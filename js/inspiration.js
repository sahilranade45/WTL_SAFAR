/**
 * SAFAR — Travel Inspiration (js/inspiration.js)
 * Interactive category filtering and dynamic rendering for Page 6
 */

document.addEventListener("DOMContentLoaded", () => {
    // Curated travel inspiration cards dataset (10 destinations across all categories)
    const inspirations = [
        {
            id: "rishikesh-rafting",
            title: "Rishikesh Rapids & Ganga Aarti",
            state: "Uttarakhand",
            category: "Adventure",
            highlight: "Thrill & Peace",
            duration: "3 Days / 2 Nights",
            description: "White-water rafting along the roaring rapids of the Ganges, cliff jumping at Shivpuri, and peaceful riverside twilight aarti.",
            features: ["River Rafting", "Cliff Jumping", "Evening Aarti"],
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "coorg-getaway",
            title: "Coorg Coffee Estate Trails",
            state: "Karnataka",
            category: "Weekend Getaways",
            highlight: "Quick Escape",
            duration: "2-3 Days",
            description: "Misty Western Ghats trails through aromatic coffee estates, Abbey Falls, Tibetan Golden Temple, and fireside homestays.",
            features: ["Estate Homestays", "Waterfalls", "Western Ghats"],
            image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "varkala-cliffs",
            title: "Varkala Cliff & Bohemian Shore",
            state: "Kerala",
            category: "Beaches",
            highlight: "Coastal Vibe",
            duration: "4 Days / 3 Nights",
            description: "Dramatic red laterite cliffs bordering the turquoise Arabian Sea, bohemian seafood cafés, natural springs, and sunset yoga.",
            features: ["Red Cliffs", "Bohemian Cafés", "Sunset Yoga"],
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "valley-of-flowers",
            title: "Valley of Flowers Alpine Trek",
            state: "Uttarakhand",
            category: "Nature",
            highlight: "Botanical Wonder",
            duration: "5 Days / 4 Nights",
            description: "UNESCO World Heritage wonderland blooming with endemic alpine flowers, surrounded by glacial cascades and snow-clad Himalayan peaks.",
            features: ["UNESCO Wonder", "Alpine Wildflowers", "Glacier Views"],
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "hampi-budget",
            title: "Hampi Ruins on a Shoestring",
            state: "Karnataka",
            category: "Budget Travel",
            highlight: "Under ₹6,000",
            duration: "3 Days / 2 Nights",
            description: "Explore boulder-strewn landscapes, majestic 14th-century Vijayanagara ruins, and cozy hippie island cafes affordably on bicycles.",
            features: ["Ancient Temples", "Bouldering", "Affordable Hostels"],
            image: "https://images.unsplash.com/photo-1600100397608-f010f443a5e1?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "bir-billing",
            title: "Bir Billing Sky Paragliding",
            state: "Himachal Pradesh",
            category: "Adventure",
            highlight: "Sky High",
            duration: "3-4 Days",
            description: "Soar among the clouds at the world's second-highest paragliding takeoff site, with Tibetan monasteries and organic tea gardens.",
            features: ["Tandem Paragliding", "Tea Gardens", "Mountain Biking"],
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "alibaug-weekend",
            title: "Alibaug Sea Fort & Coast",
            state: "Maharashtra",
            category: "Weekend Getaways",
            highlight: "Near Mumbai",
            duration: "2 Days / 1 Night",
            description: "A scenic ferry ride from Mumbai leading to historic Kolaba Sea Fort, fresh Konkani seafood, and quiet shoreline hammocks.",
            features: ["Island Ferry", "Kolaba Fort", "Fresh Seafood"],
            image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "gokarna-beaches",
            title: "Gokarna Secluded Coves Trek",
            state: "Karnataka",
            category: "Beaches",
            highlight: "Pure Serenity",
            duration: "4 Days / 3 Nights",
            description: "Trek over scenic coastal headlands between Om Beach, Kudle Beach, and Half Moon Beach while soaking in unhurried coastal serenity.",
            features: ["Beach Trekking", "Om Beach", "Unhurried Vibe"],
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "mawlynnong-root-bridges",
            title: "Mawlynnong Living Root Bridges",
            state: "Meghalaya",
            category: "Nature",
            highlight: "Living Heritage",
            duration: "4 Days / 3 Nights",
            description: "Experience Asia's cleanest village, sacred rainforest groves, crystalline Umngot River, and astonishing living tree root bridges.",
            features: ["Living Root Bridges", "Dawki River", "Cleanest Village"],
            image: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: "pushkar-budget",
            title: "Pushkar Sacred Ghats & Dunes",
            state: "Rajasthan",
            category: "Budget Travel",
            highlight: "Budget Friendly",
            duration: "3 Days / 2 Nights",
            description: "Spiritual ghats, Thar desert camel sunsets, rooftop café culture, and pocket-friendly heritage stays full of vibrant colors.",
            features: ["Desert Sunset", "Brahma Temple", "Backpacker Friendly"],
            image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80"
        }
    ];

    // DOM Elements
    const gridContainer = document.getElementById("inspirationGrid");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");
    const filterButtons = document.querySelectorAll(".filter");
    const resetFiltersBtn = document.getElementById("resetFilters");

    let currentFilter = "All";

    /**
     * Render inspiration cards into the grid
     */
    function renderCards(filteredData) {
        if (!gridContainer) return;

        gridContainer.innerHTML = "";

        if (filteredData.length === 0) {
            if (emptyState) emptyState.hidden = false;
            if (resultCount) resultCount.innerHTML = "Showing <strong>0</strong> inspirations";
            return;
        }

        if (emptyState) emptyState.hidden = true;

        if (resultCount) {
            resultCount.innerHTML = `Showing <strong>${filteredData.length}</strong> inspiration${filteredData.length === 1 ? '' : 's'}`;
        }

        filteredData.forEach((item) => {
            const card = document.createElement("article");
            card.className = "inspiration-card";
            card.setAttribute("data-category", item.category);

            const featureTags = item.features
                .map((f) => `<span class="feature-tag">${f}</span>`)
                .join("");

            card.innerHTML = `
                <div class="card-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <span class="card-category-pill">${item.category}</span>
                    <span class="card-highlight-pill">${item.highlight}</span>
                </div>
                <div class="card-body">
                    <p class="card-location">${item.state}</p>
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta-row">
                        <span class="duration">⏱️ ${item.duration}</span>
                        <span>✦ Verified Vibe</span>
                    </div>
                    <p class="card-description">${item.description}</p>
                    <div class="card-features">
                        ${featureTags}
                    </div>
                    <div class="card-footer">
                        <a href="../planner.html" class="plan-link" title="Plan itinerary with SAFAR AI">
                            Plan this Trip ↗
                        </a>
                        <a href="../explore.html" class="explore-mini-btn" title="Explore more details">
                            Explore
                        </a>
                    </div>
                </div>
            `;

            gridContainer.appendChild(card);
        });
    }

    /**
     * Filter data by category and re-render
     */
    function filterByCategory(category) {
        currentFilter = category;

        // Update active class on filter buttons
        filterButtons.forEach((btn) => {
            if (btn.getAttribute("data-category") === category) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Filter data
        const filtered =
            category === "All"
                ? inspirations
                : inspirations.filter((item) => item.category === category);

        renderCards(filtered);
    }

    // Attach click events to filter buttons
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const category = btn.getAttribute("data-category");
            if (category) {
                filterByCategory(category);
            }
        });
    });

    // Reset button in empty state
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener("click", () => {
            filterByCategory("All");
        });
    }

    // Initial render
    filterByCategory("All");
});
