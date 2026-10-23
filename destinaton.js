
const destinationDetails = {
  kashmir: {
    name: "Kashmir",
    state: "Jammu & Kashmir, India",
    category: "Mountains",
    description: "A beautiful escape of tranquil lakes, green valleys and dramatic Himalayan landscapes.",
    whyVisit: "Enjoy the peaceful scenery of Dal Lake, traditional houseboats and mountain landscapes that change with every season.",
    thingsToDo: [
      "Take a shikara ride on Dal Lake",
      "Explore the gardens of Srinagar",
      "Visit Gulmarg's mountain scenery"
    ],
    bestTime: "March to October for pleasant sightseeing. Winter brings snowfall in many areas."
  },
  manali: {
    name: "Manali",
    state: "Himachal Pradesh, India",
    category: "Mountains",
    description: "A Himalayan getaway known for mountain views, pine forests and outdoor adventures.",
    whyVisit: "Manali combines beautiful landscapes, cafés, local markets and access to a range of mountain activities.",
    thingsToDo: [
      "Visit Hadimba Devi Temple",
      "Explore Old Manali",
      "Discover Solang Valley"
    ],
    bestTime: "March to June for milder weather; December to February for a winter experience."
  },
  goa: {
    name: "Goa",
    state: "Goa, India",
    category: "Beaches",
    description: "A relaxed coastal destination with sandy beaches, Portuguese-influenced architecture and local food.",
    whyVisit: "Goa offers a mix of beach time, heritage neighbourhoods, markets and distinctive coastal cuisine.",
    thingsToDo: [
      "Relax at the beaches",
      "Explore Old Goa's churches",
      "Try local Goan cuisine"
    ],
    bestTime: "November to February is popular for beach holidays and outdoor exploration."
  },
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan, India",
    category: "Culture",
    description: "The Pink City welcomes visitors with royal architecture, colourful bazaars and Rajasthani culture.",
    whyVisit: "Explore historic forts, traditional crafts, local food and the distinctive architecture of Rajasthan.",
    thingsToDo: [
      "Visit Amber Fort",
      "See Hawa Mahal",
      "Explore Jaipur's traditional markets"
    ],
    bestTime: "October to March, when daytime temperatures are generally more comfortable."
  },
  kerala: {
    name: "Alleppey",
    state: "Kerala, India",
    category: "Nature",
    description: "A scenic Kerala destination known for its waterways, houseboats and lush landscapes.",
    whyVisit: "Slow down with backwater cruises, village scenery and a taste of Kerala's regional cuisine.",
    thingsToDo: [
      "Take a backwater cruise",
      "Explore the canals",
      "Try Kerala-style local food"
    ],
    bestTime: "November to February is generally pleasant for sightseeing."
  },
  agra: {
    name: "Agra",
    state: "Uttar Pradesh, India",
    category: "Culture",
    description: "Discover Mughal architecture and one of India's most recognisable landmarks.",
    whyVisit: "Agra is home to the Taj Mahal and other historic sites that tell stories of the Mughal era.",
    thingsToDo: [
      "Visit the Taj Mahal",
      "Explore Agra Fort",
      "Browse local handicraft markets"
    ],
    bestTime: "October to March is generally more comfortable for sightseeing."
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra, India",
    category: "Culture",
    description: "A lively coastal metropolis full of iconic architecture, local food and diverse neighbourhoods.",
    whyVisit: "Experience the Gateway of India, waterfront promenades, historic districts and the city's food scene.",
    thingsToDo: [
      "Visit the Gateway of India",
      "Walk along Marine Drive",
      "Explore historic neighbourhoods"
    ],
    bestTime: "November to February is generally more comfortable for exploring outdoors."
  },
  darjeeling: {
    name: "Darjeeling",
    state: "West Bengal, India",
    category: "Mountains",
    description: "A hill destination known for tea gardens, mountain views and its heritage toy train.",
    whyVisit: "Enjoy misty hills, tea estates, local markets and views of the Himalayan range when the weather is clear.",
    thingsToDo: [
      "Visit a tea garden",
      "Explore the Himalayan Railway",
      "See the sunrise from Tiger Hill"
    ],
    bestTime: "March to May and October to November are popular periods to visit."
  },
  andaman: {
    name: "Andaman Islands",
    state: "Andaman & Nicobar Islands, India",
    category: "Beaches",
    description: "Tropical islands with clear waters, sandy beaches and marine experiences.",
    whyVisit: "Discover coastal scenery, island landscapes and opportunities for snorkelling and other water activities.",
    thingsToDo: [
      "Visit Radhanagar Beach",
      "Explore Port Blair",
      "Try a guided snorkelling experience"
    ],
    bestTime: "October to May is generally popular for island travel; check local sea conditions."
  }
};

const params = new URLSearchParams(window.location.search);
const placeId = (params.get("place") || "").toLowerCase();
const destination = destinationDetails[placeId];

const nameElement = document.getElementById("destinationName");
const locationElement = document.getElementById("destinationLocation");
const categoryElement = document.getElementById("destinationCategory");
const descriptionElement = document.getElementById("destinationDescription");
const whyVisitElement = document.getElementById("whyVisit");
const thingsToDoElement = document.getElementById("thingsToDo");
const bestTimeElement = document.getElementById("bestTime");
const heroElement = document.getElementById("destinationHero");

function showNotFound() {
  nameElement.textContent = "Destination not found";
  locationElement.textContent = "";
  categoryElement.textContent = "KEEP EXPLORING";
  descriptionElement.textContent =
    "We couldn't find that destination. Explore our collection and choose your next adventure.";

  whyVisitElement.textContent =
    "Discover destinations across India and find the experience that suits you.";

  thingsToDoElement.replaceChildren();

  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = "explore.html";
  link.textContent = "Browse all destinations";
  item.appendChild(link);
  thingsToDoElement.appendChild(item);

  bestTimeElement.textContent = "Choose a destination to see travel suggestions.";

  const planButton = document.getElementById("planTripButton");
  planButton.textContent = "Browse destinations ↗";
  planButton.href = "explore.html";

  document.getElementById("bottomPlanButton").href = "explore.html";
  document.title = "Destination Not Found | SAFAR";
}

function renderDestination(data) {
  nameElement.textContent = data.name;
  locationElement.textContent = `⌖ ${data.state}`;
  categoryElement.textContent = `DISCOVER INDIA · ${data.category.toUpperCase()}`;
  descriptionElement.textContent = data.description;
  whyVisitElement.textContent = data.whyVisit;
  bestTimeElement.textContent = data.bestTime;

  thingsToDoElement.replaceChildren();

  data.thingsToDo.forEach((activity) => {
    const item = document.createElement("li");
    item.textContent = activity;
    thingsToDoElement.appendChild(item);
  });

  const planUrl = `planner.html?destination=${encodeURIComponent(data.name)}`;

  document.getElementById("planTripButton").href = planUrl;
  document.getElementById("bottomPlanButton").href = planUrl;
  document.getElementById("introText").textContent =
    `Discover what makes ${data.name} special and start planning your visit.`;

  document.title = `${data.name} Travel Guide | SAFAR`;

  const heroImages = {
    kashmir: "photo-1595815771614-ade9d652a65d",
    manali: "photo-1626621341517-bbf3d9990a23",
    goa: "photo-1512343879784-a960bf40e7f2",
    jaipur: "photo-1599661046827-dacff0c0f09a",
    kerala: "photo-1602216056096-3b40cc0c9944",
    agra: "photo-1564507592333-c60657eea523",
    mumbai: "photo-1570168007204-dfb528c6958f",
    darjeeling: "photo-1544735716-392fe2489ffa",
    andaman: "photo-1510414842594-a61c69b5ae57"
  };

  const photoId = heroImages[placeId];

  if (photoId) {
    heroElement.style.backgroundImage =
      `linear-gradient(90deg, rgba(12,31,26,.88), rgba(12,31,26,.25)), url("https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=2000&q=85")`;
  }
}

if (destination) {
  renderDestination(destination);
} else {
  showNotFound();
}
