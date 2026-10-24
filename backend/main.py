"""
SAFAR Travel Planner — FastAPI Backend
=======================================
This file is the main entry point for the SAFAR backend server.
It exposes REST API endpoints that the frontend uses to:
  - Confirm the server is alive (GET /)
  - Generate AI-powered travel itineraries (POST /api/generate-itinerary)

Dependencies (all installed in .venv):
  fastapi, uvicorn, google-genai, python-dotenv, pydantic
"""

import os
import json
import logging
import time

# ── python-dotenv: loads variables from a .env file into os.environ ──────────
# Place a file called ".env" in the "backend/" folder with these keys:
#   GEMINI_API_KEY=your_key_here
#   GEMINI_MODEL=gemini-2.0-flash          ← optional, has a default below
#   ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
from dotenv import load_dotenv
load_dotenv()  # reads .env → populates os.environ BEFORE anything else runs

# ── FastAPI & CORS ────────────────────────────────────────────────────────────
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ── Pydantic: data-validation library bundled with FastAPI ────────────────────
from pydantic import BaseModel, Field
from typing import List

# ── Official Google GenAI Python SDK ──────────────────────────────────────────
from google import genai
from google.genai import types as genai_types
from google.genai import errors as genai_errors

# ─────────────────────────────────────────────────────────────────────────────
# Logging setup — helps you trace what's happening in the terminal
# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("safar")

# ─────────────────────────────────────────────────────────────────────────────
# Read configuration from environment variables
# ─────────────────────────────────────────────────────────────────────────────

# GEMINI_API_KEY must be set — we validate this at startup, not here,
# so missing key errors are obvious and informative.
GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")

# Allow the model name to be overridden via .env; fall back to a safe default.
# gemini-3.5-flash-lite answers fast and has its own free quota.
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

# GEMINI_FALLBACK_MODEL: tried automatically if the primary model returns 503/504.
# Set to empty string to disable fallback.
GEMINI_FALLBACK_MODEL: str = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.5-flash")

# GEMINI_MAX_RETRIES: how many times to retry a transient error (503, 504, 429)
GEMINI_MAX_RETRIES: int = int(os.getenv("GEMINI_MAX_RETRIES", "3"))

# DEBUG_MODE=true → the real upstream error is included in the HTTP response detail.
# This makes Swagger show the actual Gemini error (e.g. wrong model, quota).
# Set to false (or remove) before deploying publicly.
DEBUG_MODE: bool = os.getenv("DEBUG_MODE", "true").lower() in ("1", "true", "yes")

# ALLOWED_ORIGINS: comma-separated list of frontend origins that may call us.
# Example in .env:  ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
_raw_origins: str = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://127.0.0.1:3000",
)
ALLOWED_ORIGINS: List[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

log.info("Allowed CORS origins: %s", ALLOWED_ORIGINS)
log.info("Using Gemini model  : %s", GEMINI_MODEL)

# ─────────────────────────────────────────────────────────────────────────────
# Create the FastAPI application
# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SAFAR Travel Planner API",
    description="AI-powered itinerary generation for the SAFAR travel planning app.",
    version="1.0.0",
)

# ── CORS middleware ───────────────────────────────────────────────────────────
# This allows the browser running the SAFAR frontend to talk to this server.
# We explicitly list allowed origins instead of using "*" for better security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   # only our known frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST"],   # only the methods we actually use
    allow_headers=["Content-Type", "Accept"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Pydantic request model
# ─────────────────────────────────────────────────────────────────────────────
class ItineraryRequest(BaseModel):
    """
    Describes the JSON body the frontend must send to /api/generate-itinerary.
    Pydantic will automatically validate types and raise a 422 error if
    anything is missing or has the wrong type.
    """
    destination: str = Field(..., description="City / country to visit", min_length=1)
    start_date: str  = Field(..., description="Trip start date, e.g. 2024-12-20")
    end_date: str    = Field(..., description="Trip end date,   e.g. 2024-12-27")
    travelers: int   = Field(..., description="Number of travellers", ge=1, le=100)
    budget: str      = Field(..., description="Budget level: Budget / Mid-range / Luxury")
    interests: List[str] = Field(default_factory=list, description="E.g. ['Food', 'History']")
    accommodation: str   = Field(..., description="E.g. Hotel, Hostel, Airbnb")
    transport: str       = Field(..., description="E.g. Public Transport, Rental Car")
    pace: str            = Field(..., description="Relaxed / Moderate / Packed")


# ─────────────────────────────────────────────────────────────────────────────
# Helper: build the prompt we send to Gemini
# ─────────────────────────────────────────────────────────────────────────────
def _build_prompt(req: ItineraryRequest) -> str:
    """
    Constructs a detailed, structured prompt so Gemini returns valid JSON
    that the frontend can parse directly.
    """
    interests_str = ", ".join(req.interests) if req.interests else "general sightseeing"

    return f"""
You are an expert travel planner. Create a detailed, practical travel itinerary and return it as VALID JSON only — no markdown fences, no extra text, just the raw JSON object.

Trip details:
- Destination   : {req.destination}
- Start date    : {req.start_date}
- End date      : {req.end_date}
- Travellers    : {req.travelers}
- Budget level  : {req.budget}
- Interests     : {interests_str}
- Accommodation : {req.accommodation}
- Transport     : {req.transport}
- Pace          : {req.pace}

Return a JSON object with EXACTLY this structure:
{{
  "trip_overview": {{
    "destination": "string",
    "duration_days": number,
    "best_season": "string",
    "currency": "string",
    "language": "string",
    "time_zone": "string",
    "summary": "2-3 sentence overview"
  }},
  "estimated_total_cost": {{
    "min": number,
    "max": number,
    "currency": "string",
    "breakdown": {{
      "accommodation": "string",
      "food": "string",
      "transport": "string",
      "activities": "string"
    }}
  }},
  "daily_plans": [
    {{
      "day": number,
      "date": "YYYY-MM-DD",
      "title": "Theme of the day",
      "morning": {{
        "activity": "string",
        "location": "string",
        "duration": "string",
        "notes": "string"
      }},
      "afternoon": {{
        "activity": "string",
        "location": "string",
        "duration": "string",
        "notes": "string"
      }},
      "evening": {{
        "activity": "string",
        "location": "string",
        "duration": "string",
        "notes": "string"
      }},
      "meals": {{
        "breakfast": "string",
        "lunch": "string",
        "dinner": "string"
      }},
      "estimated_daily_cost": "string",
      "tips": "string"
    }}
  ],
  "accommodation_suggestions": [
    {{
      "name": "string",
      "type": "string",
      "area": "string",
      "price_per_night": "string",
      "highlights": "string"
    }}
  ],
  "travel_tips": [
    "tip 1",
    "tip 2"
  ],
  "packing_essentials": [
    "item 1",
    "item 2"
  ],
  "emergency_contacts": {{
    "police": "string",
    "ambulance": "string",
    "tourist_helpline": "string"
  }}
}}

Important rules:
1. Return ONLY valid JSON — no markdown, no explanation text outside the JSON.
2. Include one entry in daily_plans for every day from {req.start_date} to {req.end_date}.
3. Tailor suggestions to the {req.budget} budget and {req.pace} pace.
4. All cost estimates should be realistic for {req.destination}.
5. Give every cost in Indian Rupees (INR) and set "currency" to "INR".
""".strip()


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint 1: Health check
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/", summary="Health check")
async def root():
    """
    Returns a simple confirmation that the SAFAR backend is running.
    Useful for quickly verifying the server started correctly.
    """
    return {
        "status": "ok",
        "message": "🌍 SAFAR Travel Planner backend is running!",
        "version": "1.0.0",
    }


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint 2: Generate itinerary
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/api/generate-itinerary", summary="Generate AI travel itinerary")
async def generate_itinerary(request: ItineraryRequest):
    """
    Accepts trip details, calls Gemini, and returns a structured JSON itinerary.

    Steps:
      1. Validate the API key is configured.
      2. Build a structured prompt from the request body.
      3. Send the prompt to Gemini via the google-genai SDK.
      4. Parse the response as JSON.
      5. Return the parsed itinerary to the frontend.
    """

    # ── Step 1: Guard against missing API key ─────────────────────────────────
    if not GEMINI_API_KEY:
        log.error("GEMINI_API_KEY is not set. Add it to backend/.env")
        # Raise an HTTP 503 (Service Unavailable) — never expose the key itself
        raise HTTPException(
            status_code=503,
            detail=(
                "The AI service is not configured. "
                "Please ask the administrator to set the GEMINI_API_KEY."
            ),
        )

    # ── Step 2: Build the prompt ──────────────────────────────────────────────
    prompt = _build_prompt(request)
    log.info(
        "Generating itinerary for '%s' (%s → %s, %d traveller(s))",
        request.destination,
        request.start_date,
        request.end_date,
        request.travelers,
    )

    # ── Step 3: Call Gemini (with retry on transient errors) ───────────────────
    # Transient errors like 503 (model overloaded) and 504 (deadline exceeded)
    # are retried up to GEMINI_MAX_RETRIES times with exponential back-off.
    # A fallback model is tried if all retries on the primary model fail.

    # Transient HTTP status codes that warrant a retry
    _RETRYABLE = {429, 503, 504}

    def _call_gemini(model_name: str) -> genai_types.GenerateContentResponse:
        """Call Gemini with retry logic. Returns the response or raises."""
        client = genai.Client(
            api_key=GEMINI_API_KEY,
            http_options=genai_types.HttpOptions(timeout=90_000),  # 90 s
        )
        last_err = None
        for attempt in range(1, GEMINI_MAX_RETRIES + 1):
            try:
                log.info("Gemini attempt %d/%d (model=%s)", attempt, GEMINI_MAX_RETRIES, model_name)
                return client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=genai_types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.7,
                        max_output_tokens=8192,
                    ),
                )
            except genai_errors.ServerError as err:
                last_err = err
                # Only retry on transient codes
                if err.code not in _RETRYABLE:
                    raise
                wait = 5 * attempt  # 5 s, 10 s, 15 s …
                log.warning(
                    "Transient error [%d] on attempt %d — waiting %ds before retry: %s",
                    err.code, attempt, wait, err,
                )
                time.sleep(wait)
            except Exception as err:
                # Non-retryable (e.g. 401, 404) — fail immediately
                raise
        raise last_err  # all retries exhausted

    try:
        response = _call_gemini(GEMINI_MODEL)
    except Exception as primary_err:
        # If the primary model failed and a fallback is configured, try it once
        if GEMINI_FALLBACK_MODEL and GEMINI_FALLBACK_MODEL != GEMINI_MODEL:
            log.warning(
                "Primary model '%s' failed (%s: %s) — trying fallback '%s'",
                GEMINI_MODEL, type(primary_err).__name__, primary_err,
                GEMINI_FALLBACK_MODEL,
            )
            try:
                response = _call_gemini(GEMINI_FALLBACK_MODEL)
                log.info("Fallback model '%s' succeeded.", GEMINI_FALLBACK_MODEL)
            except Exception as fallback_err:
                err_type = type(fallback_err).__name__
                err_msg  = str(fallback_err)
                log.error("Fallback model also failed [%s]: %s", err_type, err_msg)
                detail = (
                    f"[{err_type}] {err_msg}"
                    if DEBUG_MODE
                    else "Both the primary and fallback AI models are currently unavailable. Please try again in a few minutes."
                )
                raise HTTPException(status_code=502, detail=detail)
        else:
            err_type = type(primary_err).__name__
            err_msg  = str(primary_err)
            log.error("Gemini API call failed [%s]: %s", err_type, err_msg)
            detail = (
                f"[{err_type}] {err_msg}"
                if DEBUG_MODE
                else "Failed to reach the AI service. Please try again in a moment."
            )
            raise HTTPException(status_code=502, detail=detail)

    # ── Step 4: Parse the response ────────────────────────────────────────────
    raw_text: str = ""
    try:
        # NOTE: When response_mime_type="application/json" is set, some versions
        # of the google-genai SDK return None for response.text even on success.
        # We therefore try .text first, then fall back to the candidates path.
        raw_text = response.text

        if raw_text is None:
            # Fallback: read directly from the first candidate's first part
            raw_text = response.candidates[0].content.parts[0].text
            log.debug("Used candidates path to extract response text.")

        if raw_text is None:
            raise ValueError("Both response.text and candidates path returned None.")

        # Occasionally the model still wraps JSON in markdown fences — strip them
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]          # drop opening fence
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]                  # strip language tag
            raw_text = raw_text.rsplit("```", 1)[0]      # drop closing fence

        itinerary: dict = json.loads(raw_text.strip())

    except (json.JSONDecodeError, ValueError, AttributeError, IndexError) as parse_err:
        log.error("Could not parse Gemini response as JSON: %s", parse_err)
        log.debug("Raw response text was: %s", raw_text[:500] if raw_text else "<empty>")
        detail = (
            f"[ParseError] {parse_err}"
            if DEBUG_MODE
            else "The AI returned an unexpected response format. Please try again."
        )
        raise HTTPException(status_code=500, detail=detail)

    # ── Step 5: Return the itinerary ──────────────────────────────────────────
    log.info(
        "Itinerary generated successfully for '%s' ✓", request.destination
    )
    return JSONResponse(content={"success": True, "itinerary": itinerary})
