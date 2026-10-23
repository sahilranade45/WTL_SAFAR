const destinationDetails = {
  kashmir: {
    name: "Kashmir",
    state: "Jammu & Kashmir",
    category: "MOUNTAINS",
    description: "Discover serene lakes, alpine valleys and breathtaking Himalayan views.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Enjoy peaceful houseboat stays, mountain scenery and the warmth of Kashmiri culture.",
    thingsToDo: ["Take a shikara ride on Dal Lake", "Ride the Gulmarg Gondola", "Explore the gardens of Srinagar"],
    bestTime: "March to October for gardens and valley walks; December to February for snow."
  },
  manali: {
    name: "Manali",
    state: "Himachal Pradesh",
    category: "MOUNTAINS",
    description: "Explore pine forests, mountain roads and spectacular snowy peaks.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "A lively Himalayan escape with scenic trails, mountain views and cozy cafés.",
    thingsToDo: ["Visit Solang Valley", "Walk through Old Manali", "Explore the Hadimba Temple"],
    bestTime: "October to June for clear mountain days; December to February for snow."
  },
  goa: {
    name: "Goa",
    state: "Goa, India",
    category: "BEACHES",
    description: "Enjoy golden beaches, coastal cafés and unforgettable sunsets.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Mix laid-back beach days with Portuguese heritage, lively markets and coastal food.",
    thingsToDo: ["Relax on Palolem or Baga Beach", "Explore Old Goa's historic churches", "Try a sunset cruise on the Mandovi River"],
    bestTime: "November to February for sunny beach weather and comfortable evenings."
  },
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    category: "CULTURE",
    description: "Experience royal palaces, colourful bazaars and rich heritage.",
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Discover Rajasthan's royal architecture, crafts and celebrated local cuisine.",
    thingsToDo: ["Visit Amber Fort", "See the Hawa Mahal", "Browse the markets near Johari Bazaar"],
    bestTime: "October to March, when days are pleasant for exploring the city."
  },
  kerala: {
    name: "Alleppey",
    state: "Kerala",
    category: "NATURE",
    description: "Cruise through peaceful backwaters surrounded by lush greenery.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Slow down among Kerala's backwaters, coconut groves and village waterways.",
    thingsToDo: ["Take a backwater houseboat cruise", "Visit Alappuzha Beach", "Sample Kerala seafood and local meals"],
    bestTime: "November to February for cooler, drier weather."
  },
  agra: {
    name: "Agra",
    state: "Uttar Pradesh",
    category: "CULTURE",
    description: "Witness the Taj Mahal and explore India's magnificent Mughal history.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "See world-renowned Mughal architecture and learn the stories behind the monuments.",
    thingsToDo: ["Visit the Taj Mahal at sunrise", "Explore Agra Fort", "See the intricate inlay work at Itimad-ud-Daulah"],
    bestTime: "October to March for cooler weather and comfortable sightseeing."
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    category: "CULTURE",
    description: "Experience a lively city filled with iconic landmarks and street food.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Feel the energy of India's coastal metropolis, from historic architecture to its food scene.",
    thingsToDo: ["Walk along Marine Drive", "Visit the Gateway of India", "Explore the food stalls at Juhu Beach"],
    bestTime: "November to February for milder weather and outdoor exploring."
  },
  darjeeling: {
    name: "Darjeeling",
    state: "West Bengal",
    category: "MOUNTAINS",
    description: "Wake up to tea gardens, mountain scenery and stunning sunrises.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Take in Himalayan panoramas, heritage rail journeys and the region's famous tea gardens.",
    thingsToDo: ["Watch sunrise from Tiger Hill", "Ride the Darjeeling Himalayan Railway", "Visit a local tea estate"],
    bestTime: "March to May or October to November for clearer mountain views."
  },
  andaman: {
    name: "Andaman Islands",
    state: "Andaman & Nicobar Islands",
    category: "BEACHES",
    description: "Explore turquoise waters, tropical beaches and colourful marine life.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2000&q=85",
    whyVisit: "Escape to clear island waters, quiet beaches and vibrant coral reefs.",
    thingsToDo: ["Relax on Radhanagar Beach", "Go snorkeling at Elephant Beach", "Visit the Cellular Jail in Port Blair"],
    bestTime: "November to April for calmer seas and beach activities."
  }
};

const destination = destinationDetails[
  new URLSearchParams(window.location.search).get("place")
];

if (destination) {
  document.title = `${destination.name} | Explore with SAFAR`;
  document.getElementById("destinationName").textContent = destination.name;
  document.getElementById("destinationCategory").textContent = destination.category;
  document.getElementById("destinationLocation").textContent = destination.state;
  document.getElementById("destinationDescription").textContent = destination.description;
  document.getElementById("destinationHero").style.backgroundImage =
    `linear-gradient(90deg, rgba(12, 31, 26, .88), rgba(12, 31, 26, .25)), url("${destination.image}")`;
  document.getElementById("whyVisit").textContent = destination.whyVisit;
  document.getElementById("bestTime").textContent = destination.bestTime;
  document.getElementById("thingsToDo").replaceChildren(
    ...destination.thingsToDo.map((activity) => {
      const item = document.createElement("li");
      item.textContent = activity;
      return item;
    })
  );
  document.getElementById("planTripButton").href =
    `planner.html?destination=${encodeURIComponent(destination.name)}`;
  document.getElementById("bottomPlanButton").href =
    `planner.html?destination=${encodeURIComponent(destination.name)}`;
} else {
  document.getElementById("destinationName").textContent = "Destination not found";
  document.getElementById("destinationDescription").textContent =
    "Choose a destination from the Explore page to see its travel guide.";
  document.getElementById("planTripButton").hidden = true;
  document.getElementById("whyVisit").textContent =
    "Return to Explore and select a destination to see why it is worth visiting.";
  document.getElementById("thingsToDo").replaceChildren();
  document.getElementById("bestTime").textContent = "Select a destination to see the best time to visit.";
}
