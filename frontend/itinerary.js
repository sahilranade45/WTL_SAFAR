// itinerary.js - asks the backend for an AI itinerary and shows it on the page.

// The backend address. It is a relative URL because the same server (port 8000) serves this page.
const API_URL = "/api/generate-itinerary";

// Grab the page elements we need (found by their id in itinerary.html)
const statusBox = document.getElementById("statusBox");
const result = document.getElementById("result");
const pageHeading = document.getElementById("pageHeading");

// Small helper: makes an element such as <p> or <h3> and puts text inside it.
// textContent is safe: the text is never run as HTML, so AI text cannot inject code (XSS).
function makeElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
}

// Shows a message in the status box. isError = true makes it red.
function showStatus(message, isError) {
    statusBox.textContent = message;
    statusBox.className = isError ? "status-box error" : "status-box";
    statusBox.hidden = false;
}

// Draws the itinerary (the object that came back from Gemini) on the page.
function showItinerary(itinerary) {
    // Summary box at the top
    const summary = makeElement("div", "", "summary-box");
    summary.append(
        makeElement("p", itinerary.summary),
        makeElement("p", "Best season: " + itinerary.best_season),
        makeElement("p", "Estimated cost: " + itinerary.estimated_cost)
    );
    result.appendChild(summary);

    // One card for each day: map() turns every day object into a card
    const dayCards = itinerary.days.map(function (day) {
        const card = makeElement("div", "", "day-card");
        card.append(
            makeElement("h3", "Day " + day.day + ": " + day.title),
            makeElement("p", "Morning: " + day.morning),
            makeElement("p", "Afternoon: " + day.afternoon),
            makeElement("p", "Evening: " + day.evening)
        );
        return card;
    });
    result.append(...dayCards);

    // Travel tips as a bulleted list
    result.appendChild(makeElement("h2", "Travel tips"));
    const tipList = makeElement("ul", "", "tips");
    itinerary.tips.forEach(function (tip) {
        tipList.appendChild(makeElement("li", tip));
    });
    result.appendChild(tipList);
}

// Main job of this page: read the trip, call the backend, show the answer or the error.
async function loadItinerary() {
    // 1. Get the trip that planner.js saved
    const savedTrip = localStorage.getItem("safarTrip");
    if (!savedTrip) {
        showStatus("No trip found. Please fill in the planner first.", true);
        return;
    }
    const trip = JSON.parse(savedTrip);
    pageHeading.textContent = "Your trip to " + trip.destination;

    let data;
    try {
        // 2. Send the trip to the backend (POST with a JSON body)
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trip)
        });
        data = await response.json();

        // 3. If the backend said "no" (status 400, 422, 502 ...), show its explanation
        if (!response.ok) {
            // "detail" is a text for our own errors, or a list when the form data was invalid
            const message = typeof data.detail === "string" ? data.detail : "Some trip details are not valid.";
            showStatus(message, true);
            return;
        }
    } catch (error) {
        // fetch itself failed, so the server is probably not running
        showStatus("Could not reach the backend. Is it running at http://localhost:8000 ?", true);
        console.error(error);
        return;
    }

    // 4. Success: draw the itinerary
    try {
        showItinerary(data.itinerary);
        statusBox.hidden = true;
    } catch (error) {
        // Gemini answered, but some expected part (like "days") was missing
        result.replaceChildren();
        showStatus("Gemini's answer was not in the expected format. Please try again.", true);
        console.error(error);
    }
}

loadItinerary();
