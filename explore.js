
const destinations = [
  {
    id: "kashmir",
    name: "Kashmir",
    state: "Jammu & Kashmir",
    category: "Mountains",
    description: "Discover serene lakes, alpine valleys and breathtaking Himalayan views.",
    bestFor: "Nature & relaxation",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    category: "Mountains",
    description: "Explore pine forests, mountain roads and spectacular snowy peaks.",
    bestFor: "Adventure",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    category: "Beaches",
    description: "Enjoy golden beaches, coastal cafés and unforgettable sunsets.",
    bestFor: "Beach holidays",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    category: "Culture",
    description: "Experience royal palaces, colourful bazaars and rich heritage.",
    bestFor: "History & culture",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "kerala",
    name: "Alleppey",
    state: "Kerala",
    category: "Nature",
    description: "Cruise through peaceful backwaters surrounded by lush greenery.",
    bestFor: "Relaxation",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    category: "Culture",
    description: "Witness the Taj Mahal and explore India's magnificent Mughal history.",
    bestFor: "Heritage",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    category: "Culture",
    description: "Experience a lively city filled with iconic landmarks and street food.",
    bestFor: "City exploration",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    category: "Mountains",
    description: "Wake up to tea gardens, mountain scenery and stunning sunrises.",
    bestFor: "Scenic escapes",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "andaman",
    name: "Andaman Islands",
    state: "Andaman & Nicobar Islands",
    category: "Beaches",
    description: "Explore turquoise waters, tropical beaches and colourful marine life.",
    bestFor: "Water adventures",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=80"
  }
];

const destinationGrid = document.getElementById("destinationGrid");
const searchInput = document.getElementById("destinationSearch");
const searchForm = document.getElementById("searchForm");
const categoryFilters = document.getElementById("categoryFilters");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const resetFiltersButton = document.getElementById("resetFilters");

let selectedCategory = "All";
let searchQuery = "";

function createDestinationCard(destination) {
  const card = document.createElement("article");
  card.className = "destination-card";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "card-image";

  const image = document.createElement("img");
  image.src = destination.image;
  image.alt = `${destination.name}, ${destination.state}`;
  image.loading = "lazy";

  image.addEventListener("error", () => {
    imageWrapper.style.display = "none";
  }, { once: true });

  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = destination.category;

  imageWrapper.append(image, tag);

  const body = document.createElement("div");
  body.className = "card-body";

  const location = document.createElement("p");
  location.className = "card-location";
  location.textContent = destination.state;

  const title = document.createElement("h3");
  title.textContent = destination.name;

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = destination.description;

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const bestFor = document.createElement("span");
  bestFor.textContent = destination.bestFor;

  const detailsLink = document.createElement("a");
  detailsLink.className = "details-link";
  detailsLink.href = `destination.html?place=${encodeURIComponent(destination.id)}`;
  detailsLink.textContent = "Explore ↗";
  detailsLink.setAttribute(
    "aria-label",
    `Explore ${destination.name}`
  );

  footer.append(bestFor, detailsLink);
  body.append(location, title, description, footer);
  card.append(imageWrapper, body);

  return card;
}

function renderDestinations() {
  const filteredDestinations = destinations.filter((destination) => {
    const matchesCategory =
      selectedCategory === "All" ||
      destination.category === selectedCategory;

    const searchableText = [
      destination.name,
      destination.state,
      destination.category,
      destination.description,
      destination.bestFor
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  destinationGrid.replaceChildren();

  filteredDestinations.forEach((destination) => {
    destinationGrid.appendChild(createDestinationCard(destination));
  });

  resultCount.textContent =
    `${filteredDestinations.length} destination${filteredDestinations.length === 1 ? "" : "s"}`;

  emptyState.hidden = filteredDestinations.length !== 0;
  destinationGrid.hidden = filteredDestinations.length === 0;
}

function updateSearch() {
  searchQuery = searchInput.value.trim().toLowerCase();
  renderDestinations();
}

searchInput.addEventListener("input", updateSearch);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateSearch();

  document.querySelector(".destinations-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  selectedCategory = button.dataset.category;

  categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
    const isActive = filter === button;
    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });

  renderDestinations();
});

resetFiltersButton.addEventListener("click", () => {
  selectedCategory = "All";
  searchQuery = "";
  searchInput.value = "";

  categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
    const isActive = filter.dataset.category === "All";
    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });

  renderDestinations();
});

categoryFilters.querySelectorAll("[data-category]").forEach((filter) => {
  filter.setAttribute(
    "aria-pressed",
    String(filter.dataset.category === "All")
  );
});

renderDestinations();
