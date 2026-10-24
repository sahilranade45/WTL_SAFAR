"""
SAFAR Travel Planner - FastAPI backend (simple version)

This one file does two jobs:
  1. API  : POST /api/generate-itinerary  -> asks Google Gemini for a trip plan
  2. Pages: serves the HTML/CSS/JS files from the ../frontend folder

Run it (from the backend folder):
    uvicorn main:app --reload --port 8000
Then open http://localhost:8000
"""

import json
import os
import time
from datetime import date
from typing import List

# python-dotenv reads backend/.env so the API key stays out of the code
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Google's official Gemini library
from google import genai
from google.genai import errors as genai_errors
from google.genai import types as genai_types

load_dotenv()  # copies the values in .env into os.environ

# ---------- Settings (change these in backend/.env, not here) ----------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # secret: never print it or send it to the browser
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")  # which Gemini model to use
MAX_DAYS = 7  # longest trip we allow (must match MAX_DAYS in frontend/planner.js)

# The frontend folder sits next to the backend folder
FRONTEND_FOLDER = os.path.join(os.path.dirname(__file__), "..", "frontend")

app = FastAPI(title="SAFAR Travel Planner")


# ---------- What the browser must send us ----------
class ItineraryRequest(BaseModel):
    """The JSON body of the request. FastAPI checks it automatically and
    answers with error 422 if something is missing or has the wrong type."""
    destination: str = Field(min_length=2)
    start_date: date  # written as YYYY-MM-DD
    end_date: date
    travelers: int = Field(ge=1, le=20)
    budget: str  # Budget / Moderate / Luxury
    interests: List[str] = []


def build_prompt(trip: ItineraryRequest, days: int) -> str:
    """Turns the trip details into the instructions we send to Gemini."""
    interests = ", ".join(trip.interests) or "general sightseeing"
    return f"""You are a travel planner. Reply with JSON only, in exactly this shape:
{{
  "summary": "2 sentences about the trip",
  "best_season": "text",
  "estimated_cost": "text, in Indian rupees, for all travellers",
  "days": [
    {{"day": 1, "title": "theme of the day", "morning": "text", "afternoon": "text", "evening": "text"}}
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}}

Trip details:
- Destination: {trip.destination}
- Dates: {trip.start_date} to {trip.end_date} ({days} days)
- Travellers: {trip.travelers}
- Budget style: {trip.budget}
- Interests: {interests}

Rules: the "days" list must have exactly {days} items. Keep every text short (one or two sentences)."""


def explain_gemini_error(err: genai_errors.APIError) -> str:
    """Turns a Gemini error code into a message a human can understand."""
    if err.code in (401, 403):
        return "Gemini rejected the API key. Check GEMINI_API_KEY in backend/.env."
    if err.code == 404:
        return f"Gemini model '{GEMINI_MODEL}' was not found. Check GEMINI_MODEL in backend/.env."
    if err.code == 429:
        return "Gemini quota or rate limit reached. Wait a minute and try again."
    if err.code == 400:
        return "Gemini refused the request (bad request or invalid API key)."
    if err.code in (500, 503, 504):
        return f"Gemini is busy or timed out (error {err.code}, model '{GEMINI_MODEL}'). This is on Google's side. Wait a minute and try again, or set another GEMINI_MODEL in backend/.env."
    return f"Gemini had a problem (error {err.code}). Please try again later."


# ---------- Route 1: make an itinerary ----------
# A plain "def" (not "async def") so FastAPI runs this slow Gemini call in a separate thread.
@app.post("/api/generate-itinerary")
def generate_itinerary(trip: ItineraryRequest):
    """Checks the trip, asks Gemini for a plan and sends it back as JSON."""

    # 1. The key must exist (we only say it is missing, we never show it)
    if not GEMINI_API_KEY:
        raise HTTPException(503, "GEMINI_API_KEY is missing. Add it to backend/.env and restart.")

    # 2. Check the dates
    days = (trip.end_date - trip.start_date).days + 1
    if days < 1:
        raise HTTPException(400, "End date cannot be before the start date.")
    if days > MAX_DAYS:
        raise HTTPException(400, f"Trips can be at most {MAX_DAYS} days long.")

    # 3. Ask Gemini (if Google says "busy" we wait 3 seconds and try again, up to 3 times)
    client = genai.Client(
        api_key=GEMINI_API_KEY,
        http_options=genai_types.HttpOptions(timeout=90_000),  # give up after 90 seconds
    )
    response = None
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=build_prompt(trip, days),
                config=genai_types.GenerateContentConfig(
                    response_mime_type="application/json",  # ask for JSON only
                    max_output_tokens=8192,
                ),
            )
            break  # it worked, stop trying
        except genai_errors.APIError as err:
            # 429 / 500 / 503 / 504 mean "busy", so try again. Anything else (bad key, bad model) will not fix itself.
            if err.code in (429, 500, 503, 504) and attempt < 2:
                print(f"Gemini busy (error {err.code}), trying again...")
                time.sleep(3)
                continue
            # Print Google's message in this terminal and send the browser a short explanation
            print(f"Gemini error {err.code} {err.status}: {err.message}")
            raise HTTPException(502, explain_gemini_error(err))
        except Exception:
            # No internet, timeout, etc.
            raise HTTPException(502, "Could not reach Gemini. Check your internet connection.")

    # 4. Turn Gemini's text into a Python dictionary
    try:
        itinerary = json.loads(response.text)
    except (json.JSONDecodeError, TypeError):
        raise HTTPException(502, "Gemini sent an answer that is not valid JSON. Please try again.")

    return {"itinerary": itinerary}


# ---------- Route 2: show the website ----------
# This must come LAST. It serves ONLY the frontend folder, so backend/.env
# and main.py can never be downloaded from the browser.
app.mount("/", StaticFiles(directory=FRONTEND_FOLDER, html=True), name="frontend")
