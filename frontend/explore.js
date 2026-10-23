// explore.js - shows destination cards and lets the visitor filter and search them.

// The list of destinations (an array of objects). To add a place, add one more { ... } here.
const destinations = [
    { name: "Kashmir", state: "Jammu & Kashmir", category: "Mountains", description: "Serene lakes, alpine valleys and Himalayan views.", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80" },
    { name: "Manali", state: "Himachal Pradesh", category: "Mountains", description: "Pine forests, mountain roads and snowy peaks.", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80" },
    { name: "Darjeeling", state: "West Bengal", category: "Mountains", description: "Tea gardens, mountain scenery and stunning sunrises.", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80" },
    { name: "Goa", state: "Goa", category: "Beaches", description: "Golden beaches, coastal cafes and sunsets.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80" },
    { name: "Andaman Islands", state: "Andaman & Nicobar Islands", category: "Beaches", description: "Turquoise water, tropical beaches and marine life.", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=80" },
    { name: "Jaipur", state: "Rajasthan", category: "Culture", description: "Royal palaces, colourful bazaars and rich heritage.", image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80" },
    { name: "Agra", state: "Uttar Pradesh", category: "Culture", description: "The Taj Mahal and magnificent Mughal history.", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80" },
    { name: "Mumbai", state: "Maharashtra", category: "Culture", description: "A lively city of landmarks and street food.", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80" },
    { name: "Alleppey", state: "Kerala", category: "Nature", description: "Peaceful backwaters surrounded by lush greenery.", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80" }
];

// Grab the page elements we need (found by their id in explore.html)
const destinationGrid = document.getElementById("destinationGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");
const emptyMessage = document.getElementById("emptyMessage");

// Remember what the visitor has chosen so far
let selectedCategory = "All";
let searchText = "";

// Builds ONE card for ONE destination and returns it.
// We use textContent (not innerHTML) so text can never run as code (prevents XSS).
function createCard(destination) {
    const card = document.createElement("article");
    card.className = "card";

    const imageBox = document.createElement("div");
    imageBox.className = "card-image";

    const image = document.createElement("img");
    image.src = destination.image;
    image.alt = destination.name + ", " + destination.state;

    const tag = document.createElement("span");
    tag.className = "card-tag";
    tag.textContent = destination.category;

    imageBox.append(image, tag);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = destination.name;

    const description = document.createElement("p");
    description.textContent = destination.state + " - " + destination.description;

    // The link opens the planner with the destination already filled in
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = "planner.html?destination=" + encodeURIComponent(destination.name);
    link.textContent = "Plan this trip →";

    body.append(title, description, link);
    card.append(imageBox, body);
    return card;
}

// Shows only the destinations that match the chosen category AND the search text.
function showDestinations() {
    // filter() keeps only the destinations that pass the test
    const matches = destinations.filter(function (destination) {
        const categoryOk = selectedCategory === "All" || destination.category === selectedCategory;
        const text = (destination.name + " " + destination.state).toLowerCase();
        const searchOk = text.includes(searchText);
        return categoryOk && searchOk;
    });

    destinationGrid.replaceChildren();                       // clear the old cards
    matches.forEach(function (destination) {                 // add one card per match
        destinationGrid.appendChild(createCard(destination));
    });

    emptyMessage.hidden = matches.length > 0;                // show message if no match
}

// When the visitor types in the search box, update the list.
searchInput.addEventListener("input", function () {
    searchText = searchInput.value.trim().toLowerCase();
    showDestinations();
});

// When the visitor clicks a category button, remember it and update the list.
filters.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    selectedCategory = button.dataset.category;            // reads data-category="..."

    // Highlight only the clicked button
    filters.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b === button);
    });

    showDestinations();
});

// Show all cards when the page first loads.
showDestinations();
