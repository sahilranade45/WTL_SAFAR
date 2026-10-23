let currentStep = 1;

const totalSteps = 5;

let adults = 2;
let children = 0;


/* =========================
   STEP MANAGEMENT
========================= */

function showStep(step) {

    document.querySelectorAll(".planner-step")
        .forEach((section) => {

            section.classList.remove("active");

        });


    const selectedStep =
        document.querySelector(
            `.planner-step[data-step="${step}"]`
        );

    selectedStep.classList.add("active");


    /* Update progress */

    const percentage =
        (step / totalSteps) * 100;

    document.getElementById("progressFill")
        .style.width = `${percentage}%`;


    document.getElementById("stepLabel")
        .textContent =
        `STEP ${step} OF ${totalSteps}`;


    document.getElementById("progressPercent")
        .textContent =
        `${percentage}%`;


    /* Back button */

    const backButton =
        document.getElementById("backBtn");

    if (step === 1) {

        backButton.style.visibility =
            "hidden";

    } else {

        backButton.style.visibility =
            "visible";

    }


    /* Next button */

    const nextButton =
        document.getElementById("nextBtn");

    if (step === totalSteps) {

        nextButton.textContent =
            "✨ Generate My Trip";

    } else {

        nextButton.textContent =
            "Continue →";

    }

}


/* =========================
   NEXT
========================= */

function nextStep() {

    if (!validateStep()) {
        return;
    }


    if (currentStep < totalSteps) {

        currentStep++;

        showStep(currentStep);

    } else {

        generateTrip();

    }

}


/* =========================
   PREVIOUS
========================= */

function previousStep() {

    if (currentStep > 1) {

        currentStep--;

        showStep(currentStep);

    }

}


/* =========================
   VALIDATION
========================= */

function validateStep() {

    if (currentStep === 1) {

        const destination =
            document.getElementById(
                "destination"
            ).value.trim();


        if (!destination) {

            alert(
                "Please choose or enter a destination."
            );

            return false;

        }

    }


    if (currentStep === 2) {

        const startDate =
            document.getElementById(
                "startDate"
            ).value;

        const endDate =
            document.getElementById(
                "endDate"
            ).value;


        if (!startDate || !endDate) {

            alert(
                "Please select your travel dates."
            );

            return false;

        }


        if (new Date(endDate) < new Date(startDate)) {

            alert(
                "End date cannot be before the start date."
            );

            return false;

        }

    }


    if (currentStep === 3) {

        const budget =
            document.getElementById(
                "budget"
            ).value;


        if (!budget || budget <= 0) {

            alert(
                "Please enter your approximate budget."
            );

            return false;

        }

    }


    return true;

}


/* =========================
   DESTINATION SELECTION
========================= */

document.querySelectorAll(
    ".destination-option"
).forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            document.querySelectorAll(
                ".destination-option"
            ).forEach((item) => {

                item.classList.remove(
                    "selected"
                );

            });


            button.classList.add(
                "selected"
            );


            document.getElementById(
                "destination"
            ).value =
                button.dataset.destination;

        }
    );

});


/* =========================
   COUNTERS
========================= */

function changeCount(type, amount) {

    if (type === "adults") {

        adults += amount;

        if (adults < 1) {
            adults = 1;
        }

        if (adults > 20) {
            adults = 20;
        }

        document.getElementById(
            "adults"
        ).textContent = adults;

    }


    if (type === "children") {

        children += amount;

        if (children < 0) {
            children = 0;
        }

        if (children > 10) {
            children = 10;
        }

        document.getElementById(
            "children"
        ).textContent = children;

    }

}


/* =========================
   BUDGET
========================= */

document.querySelectorAll(
    ".budget-option"
).forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            document.querySelectorAll(
                ".budget-option"
            ).forEach((item) => {

                item.classList.remove(
                    "selected"
                );

            });

            button.classList.add(
                "selected"
            );

        }
    );

});


/* =========================
   INTERESTS
========================= */

document.querySelectorAll(
    ".interest-card"
).forEach((card) => {

    card.addEventListener(
        "click",
        () => {

            card.classList.toggle(
                "selected"
            );

        }
    );

});


/* =========================
   PREFERENCES
========================= */

document.querySelectorAll(
    ".choice-row"
).forEach((row) => {

    const choices =
        row.querySelectorAll(".choice");


    choices.forEach((choice) => {

        choice.addEventListener(
            "click",
            () => {

                choices.forEach((item) => {

                    item.classList.remove(
                        "active"
                    );

                });

                choice.classList.add(
                    "active"
                );

            }
        );

    });

});


/* =========================
   GENERATE TRIP
========================= */

function generateTrip() {

    /* --- Destination --- */
    const destination =
        document.getElementById("destination").value.trim();

    /* --- Dates --- */
    const startDate =
        document.getElementById("startDate").value;
    const endDate =
        document.getElementById("endDate").value;

    /* --- Travellers --- */
    const adultsVal =
        parseInt(document.getElementById("adults").textContent, 10) || adults;
    const childrenVal =
        parseInt(document.getElementById("children").textContent, 10) || children;

    /* --- Budget --- */
    const budgetAmount =
        document.getElementById("budget").value;
    const selectedBudgetOption =
        document.querySelector(".budget-option.selected");
    const budgetStyle = selectedBudgetOption
        ? selectedBudgetOption.dataset.budget
        : "Moderate";

    /* --- Interests --- */
    /* Extract label text only; card.textContent includes the emoji span text */
    const interests = [];
    document.querySelectorAll(".interest-card.selected").forEach(card => {
        // Grab text nodes directly (excluding the child emoji <span>)
        let label = '';
        card.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                label += node.textContent;
            }
        });
        label = label.trim();
        if (label) {
            interests.push(label);
        } else {
            // Fallback: full textContent without leading emoji segment
            interests.push(card.textContent.replace(/^\s*\S+\s+/, '').trim());
        }
    });

    /* --- Preferences (accommodation, transport, pace) --- */
    const preferenceGroups =
        document.querySelectorAll(".preference-group");

    let accommodation = "";
    let transport = "";
    let pace = "";

    if (preferenceGroups[0]) {
        const activeChoice =
            preferenceGroups[0].querySelector(".choice.active");
        accommodation = activeChoice
            ? activeChoice.textContent.trim()
            : "Hotel";
    }
    if (preferenceGroups[1]) {
        const activeChoice =
            preferenceGroups[1].querySelector(".choice.active");
        transport = activeChoice
            ? activeChoice.textContent.trim()
            : "Mixed";
    }
    if (preferenceGroups[2]) {
        const activeChoice =
            preferenceGroups[2].querySelector(".choice.active");
        pace = activeChoice
            ? activeChoice.textContent.trim()
            : "Balanced";
    }

    /* --- Build structured trip object --- */
    const tripData = {
        destination,
        startDate,
        endDate,
        adults:       adultsVal,
        children:     childrenVal,
        budget:       budgetAmount,
        budgetStyle,
        interests,
        accommodation,
        transport,
        pace,
        createdAt:    new Date().toISOString()
    };

    /* --- Persist to localStorage --- */

    /* Keep legacy key so any code that reads safarDestination still works */
    localStorage.setItem("safarDestination", destination);

    /* Full structured trip under a new key */
    localStorage.setItem("safarTrip", JSON.stringify(tripData));

    /* --- Navigate to results page --- */
    window.location.href = "itinerary.html";

}


/* =========================
   INITIAL STATE
========================= */

showStep(1);


/* =========================
   URL PARAM PREFILL
   Pre-fills the destination
   input when arriving from
   destination.html via
   planner.html?destination=X
========================= */

(function prefillDestinationFromURL() {

    const param = new URLSearchParams(window.location.search)
        .get("destination");

    if (!param) return;

    const input = document.getElementById("destination");
    if (input) {
        input.value = param;
    }

    /* Also highlight a matching quick-pick button if one exists */
    document.querySelectorAll(".destination-option").forEach(btn => {
        const matches =
            btn.dataset.destination &&
            btn.dataset.destination.toLowerCase() === param.toLowerCase();

        btn.classList.toggle("selected", matches);
    });

}());