// planner.js - checks the planner form and sends the visitor to the itinerary page.

// ----- Limits and messages (change a number or sentence here to change the rule) -----
const MIN_DESTINATION_LENGTH = 2;   // shortest allowed destination name
const MAX_TRAVELERS = 20;           // most travellers allowed
const MAX_DAYS = 7;                 // longest trip (must match MAX_DAYS in backend/main.py)

// Grab the page elements we need (found by their id in planner.html)
const tripForm = document.getElementById("tripForm");
const formError = document.getElementById("formError");

// Reads the form and returns the trip as an object.
// The names (start_date, end_date ...) match what the backend expects (see ItineraryRequest in main.py).
function readTrip() {
    // Collect the value of every ticked interest checkbox
    const interests = [];
    document.querySelectorAll("#interests input:checked").forEach(function (box) {
        interests.push(box.value);
    });

    return {
        destination: document.getElementById("destination").value.trim(),
        start_date: document.getElementById("startDate").value,
        end_date: document.getElementById("endDate").value,
        travelers: Number(document.getElementById("travelers").value),
        budget: document.getElementById("budget").value,
        interests: interests
    };
}

// Checks the trip. Returns an error message, or "" when everything is fine.
function validateForm(trip) {
    if (trip.destination.length < MIN_DESTINATION_LENGTH) {
        return "Please enter a destination (at least " + MIN_DESTINATION_LENGTH + " letters).";
    }
    if (!trip.start_date || !trip.end_date) {
        return "Please select your travel dates.";
    }
    if (trip.end_date < trip.start_date) {           // YYYY-MM-DD text compares correctly
        return "End date cannot be before the start date.";
    }

    // Count the days: milliseconds difference / milliseconds in one day, plus 1
    const days = (new Date(trip.end_date) - new Date(trip.start_date)) / 86400000 + 1;
    if (days > MAX_DAYS) {
        return "Trips can be at most " + MAX_DAYS + " days long.";
    }
    if (!Number.isInteger(trip.travelers) || trip.travelers < 1 || trip.travelers > MAX_TRAVELERS) {
        return "Travellers must be a number from 1 to " + MAX_TRAVELERS + ".";
    }
    return "";
}

// Runs when the form is submitted (button click or Enter key).
tripForm.addEventListener("submit", function (event) {
    event.preventDefault();                          // stop the browser reloading the page

    const trip = readTrip();
    const message = validateForm(trip);

    if (message) {                                   // something is wrong: show it and stop
        formError.textContent = message;
        formError.hidden = false;
        return;
    }

    formError.hidden = true;
    localStorage.setItem("safarTrip", JSON.stringify(trip));   // hand the trip to the next page
    window.location.href = "itinerary.html";
});

// If we arrived from the Explore page (planner.html?destination=Goa), fill in the destination.
const destinationFromLink = new URLSearchParams(window.location.search).get("destination");
if (destinationFromLink) {
    document.getElementById("destination").value = destinationFromLink;
}
