/* ================================================
   SAFAR — itinerary.js
   Reads trip data from localStorage (set by planner.js),
   renders a destination-appropriate day-by-day itinerary,
   experience highlights, and budget breakdown.

   No live AI API is connected. All content is
   generated from local template data.
   A note on the page makes this clear to users.
   ================================================ */

/* ================================================
   DESTINATION DATA
   Activities keyed by the destination ID used in
   planner.html and explore.js
   ================================================ */

const DESTINATION_DATA = {
    kashmir: {
        label: 'Kashmir',
        heroClass: 'bg-kashmir',
        days: [
            {
                title: 'Arrival & Dal Lake',
                morning: { title: 'Arrive in Srinagar', desc: 'Check in to your houseboat or hotel. Take a gentle shikara ride on the calm morning waters of Dal Lake.' },
                afternoon: { title: 'Mughal Gardens', desc: 'Visit Shalimar Bagh and Nishat Bagh — beautifully terraced Mughal gardens overlooking the lake.' },
                evening: { title: 'Floating Market', desc: 'Return to Dal Lake for the floating vegetable market at dusk, followed by Kashmiri kahwa tea on your houseboat.' }
            },
            {
                title: 'Gulmarg Day Trip',
                morning: { title: 'Gulmarg Gondola', desc: 'Take an early drive to Gulmarg and ride the Gondola cable car to Apharwat Peak for sweeping Himalayan views.' },
                afternoon: { title: 'Meadow Walks', desc: 'Stroll the high alpine meadows, visit the Golf Club, and stop at a local dhaba for Rogan Josh and rice.' },
                evening: { title: 'Drive Back to Srinagar', desc: 'Return to Srinagar in the early evening. Explore the artisan shops on Residency Road for walnut woodcraft.' }
            },
            {
                title: 'Old City Exploration',
                morning: { title: 'Jama Masjid & Khanqah', desc: 'Walk through Srinagar\'s old city. Visit the intricate wooden Jama Masjid and the historic Khanqah Shah Hamdan.' },
                afternoon: { title: 'Shankaracharya Temple', desc: 'Climb Shankaracharya Hill for a panoramic view of the valley. The ancient temple at the top is a quiet retreat.' },
                evening: { title: 'Lal Chowk & Cuisine', desc: 'Visit Lal Chowk in the evening, try Seekh Kebabs at a local restaurant, and browse traditional Pashmina shawl shops.' }
            },
            {
                title: 'Pahalgam & Aru Valley',
                morning: { title: 'Drive to Pahalgam', desc: 'Drive through the Lidder River valley to Pahalgam — a scenic mountain town surrounded by pine forests.' },
                afternoon: { title: 'Aru Valley Trek', desc: 'Take a short pony ride or hike to Aru Valley, with meadows and views of snow-capped peaks.' },
                evening: { title: 'Campfire Dinner', desc: 'Return to your camp or hotel by the river. Local guides often arrange campfire evenings with Kashmiri music.' }
            },
            {
                title: 'Sonamarg & Return',
                morning: { title: 'Glacier Views at Sonamarg', desc: 'Make a day trip to Sonamarg — the "Meadow of Gold". The glaciers here are accessible on ponies.' },
                afternoon: { title: 'Thajiwas Glacier', desc: 'Walk toward Thajiwas Glacier. Pack lunch from a local eatery — trout (grilled river fish) is a local speciality.' },
                evening: { title: 'Farewell Evening', desc: 'Return to Srinagar. Enjoy a final evening on the houseboat watching the lights of Dal Lake.' }
            }
        ],
        experiences: [
            { icon: '🛶', category: 'Water', title: 'Shikara Ride', desc: 'Glide across Dal Lake on a decorated wooden shikara boat — a timeless Kashmiri experience.' },
            { icon: '🚡', category: 'Adventure', title: 'Gulmarg Gondola', desc: 'Asia\'s highest cable car offers panoramic views of the Himalayas at 13,000 ft.' },
            { icon: '🌿', category: 'Nature', title: 'Mughal Gardens', desc: 'Terraced gardens designed by Mughal emperors, famous for their chenar trees and fountains.' },
            { icon: '🍵', category: 'Culture', title: 'Kahwa Tea Experience', desc: 'Sip traditional Kashmiri green tea blended with saffron, cardamom, and almond flakes.' }
        ],
        budgetKeys: { accommodation: 0.38, food: 0.22, transport: 0.20, activities: 0.20 }
    },

    manali: {
        label: 'Manali',
        heroClass: 'bg-manali',
        days: [
            {
                title: 'Arrival & Old Manali',
                morning: { title: 'Arrive & Settle In', desc: 'Check in to your hotel or hostel. Freshen up and take a short walk around the main market area.' },
                afternoon: { title: 'Hadimba Temple', desc: 'Visit the ancient Hadimba Devi Temple set within a dense cedar forest — one of Manali\'s most serene spots.' },
                evening: { title: 'Old Manali Café Hop', desc: 'Explore the café-lined lanes of Old Manali. Try apple tea and local Himachali cuisine at a rooftop restaurant.' }
            },
            {
                title: 'Solang Valley',
                morning: { title: 'Drive to Solang', desc: 'Head to Solang Valley early to avoid crowds. The drive through apple orchards and pine groves is beautiful.' },
                afternoon: { title: 'Snow & Adventures', desc: 'Depending on season, enjoy skiing, zorbing, or paragliding. Try the zipline across the valley.' },
                evening: { title: 'Beas River Walk', desc: 'Walk along the Beas River near Vashisht. Visit the Vashisht Hot Springs and the village temple.' }
            },
            {
                title: 'Rohtang Pass',
                morning: { title: 'Rohtang Pass (seasonal)', desc: 'Start very early for Rohtang Pass (open May–Oct). The road climbs through dramatic landscape to 13,050 ft.' },
                afternoon: { title: 'Snow Activities', desc: 'Enjoy snow sports at Rohtang. Pack warm clothes and grab Maggi noodles at a roadside stall — it\'s a tradition.' },
                evening: { title: 'Return & Rest', desc: 'Return to Manali by early evening. Rest and try trout fish curry at one of the riverside restaurants.' }
            },
            {
                title: 'Naggar & Culture',
                morning: { title: 'Naggar Castle', desc: 'Drive to Naggar, a quiet village with a medieval castle overlooking the Kullu Valley. The views are superb.' },
                afternoon: { title: 'Roerich Art Gallery', desc: 'Visit the Nicholas Roerich Art Gallery, housed in his former estate. His Himalayan paintings are remarkable.' },
                evening: { title: 'Local Market', desc: 'Return to Manali\'s Mall Road. Pick up Himachali shawls, apple products, and dried fruits as souvenirs.' }
            }
        ],
        experiences: [
            { icon: '🏔️', category: 'Adventure', title: 'Solang Valley', desc: 'A wide valley famous for skiing in winter and paragliding and zorbing in summer.' },
            { icon: '🛕', category: 'Culture', title: 'Hadimba Temple', desc: 'A 16th-century pagoda-style temple surrounded by cedar forest, dedicated to the goddess Hadimba.' },
            { icon: '🌊', category: 'Nature', title: 'Beas River Rafting', desc: 'White-water rafting on the Beas River with rapids ranging from Grade II to IV.' },
            { icon: '🎿', category: 'Sports', title: 'Rohtang Pass', desc: 'India\'s most accessible high-altitude snow point, offering skiing and snow activities in season.' }
        ],
        budgetKeys: { accommodation: 0.32, food: 0.24, transport: 0.22, activities: 0.22 }
    },

    goa: {
        label: 'Goa',
        heroClass: 'bg-goa',
        days: [
            {
                title: 'Arrival & North Goa',
                morning: { title: 'Arrive & Check In', desc: 'Settle in to your beach shack or hotel. Head straight to the beach for a refreshing first dip.' },
                afternoon: { title: 'Calangute to Baga', desc: 'Explore the busy beaches of Calangute and Baga. Try fresh seafood at a shack — grilled prawns are a must.' },
                evening: { title: 'Tito\'s Lane', desc: 'The evening comes alive in North Goa. Stroll Tito\'s Lane, watch street performers, and catch the sunset.' }
            },
            {
                title: 'Old Goa Heritage',
                morning: { title: 'Basilica of Bom Jesus', desc: 'Visit Old Goa in the morning when it\'s cooler. The Basilica of Bom Jesus holds the remains of St Francis Xavier.' },
                afternoon: { title: 'Church Circuit', desc: 'Walk to the Se Cathedral and the Chapel of St Catherine. The Portuguese architecture is beautifully preserved.' },
                evening: { title: 'Sunset Cruise', desc: 'Board a sunset cruise on the Mandovi River. Goan folk music, coconut feni, and a golden sky — a classic evening.' }
            },
            {
                title: 'South Goa & Palolem',
                morning: { title: 'Palolem Beach', desc: 'Drive south to Palolem — a crescent bay with calmer, cleaner waters than the north. Ideal for swimming.' },
                afternoon: { title: 'Kayaking & Dolphins', desc: 'Book a dolphin spotting boat trip. Afterwards, hire a kayak and explore the small rocky islands off the beach.' },
                evening: { title: 'Silent Noise Party', desc: 'Palolem is famous for its silent disco nights where everyone wears headphones. A unique Goan experience.' }
            },
            {
                title: 'Spice Farm & Night Market',
                morning: { title: 'Spice Plantation Tour', desc: 'Visit a Goan spice plantation in the interior. Walk through gardens of pepper, cardamom and vanilla.' },
                afternoon: { title: 'Dudhsagar Falls (optional)', desc: 'If the season is right, take a jeep safari to Dudhsagar Waterfalls — one of India\'s tallest cascades.' },
                evening: { title: 'Anjuna Flea Market', desc: 'On Wednesdays, the famous Anjuna market is the place for handicrafts, jewellery and handwoven fabrics.' }
            }
        ],
        experiences: [
            { icon: '🏖️', category: 'Beaches', title: 'Palolem Beach', desc: 'One of Goa\'s most scenic crescent beaches, calmer than the north and great for kayaking.' },
            { icon: '⛵', category: 'Water', title: 'Mandovi Sunset Cruise', desc: 'A classic Goa experience — traditional music, local drinks, and a glowing sunset over the river.' },
            { icon: '⛪', category: 'Heritage', title: 'Old Goa Churches', desc: 'UNESCO-listed Portuguese Baroque churches that tell Goa\'s 500 years of colonial history.' },
            { icon: '🌶️', category: 'Food', title: 'Goan Cuisine', desc: 'Prawn balchão, fish curry rice, bebinca dessert — Goa\'s food is unlike anywhere else in India.' }
        ],
        budgetKeys: { accommodation: 0.35, food: 0.27, transport: 0.18, activities: 0.20 }
    },

    jaipur: {
        label: 'Jaipur',
        heroClass: 'bg-jaipur',
        days: [
            {
                title: 'Arrival & City Palace',
                morning: { title: 'Arrive & City Palace', desc: 'Check in and head to the City Palace — home to the Jaipur royal family, with fine Rajput and Mughal architecture.' },
                afternoon: { title: 'Jantar Mantar', desc: 'Walk to Jantar Mantar, an 18th-century astronomical observatory with the world\'s largest stone sundial.' },
                evening: { title: 'Hawa Mahal at Dusk', desc: 'Watch the Hawa Mahal (Palace of Winds) turn pink and golden in the late afternoon light from the street.' }
            },
            {
                title: 'Amber Fort & Nahargarh',
                morning: { title: 'Amber Fort', desc: 'Take an early jeep ride to Amber Fort. The mirrored Sheesh Mahal (Hall of Mirrors) alone is worth the trip.' },
                afternoon: { title: 'Nahargarh Fort', desc: 'Drive up to Nahargarh Fort for sweeping views of Jaipur. The café at the top serves cold lassi.' },
                evening: { title: 'Johari Bazaar', desc: 'Browse the gemstone and jewellery market at Johari Bazaar. Jaipur is one of the world\'s gem-cutting centres.' }
            },
            {
                title: 'Markets & Local Life',
                morning: { title: 'Bapu Bazaar', desc: 'Shop for block-print fabrics, juttis (leather shoes), and traditional Rajasthani textiles at Bapu Bazaar.' },
                afternoon: { title: 'Birla Mandir', desc: 'Visit the white marble Birla Mandir — a modern temple with beautiful carvings and a peaceful interior.' },
                evening: { title: 'Dal Baati Churma', desc: 'End your Jaipur trip with a traditional Rajasthani thali dinner — dal baati churma is the signature dish.' }
            }
        ],
        experiences: [
            { icon: '🏰', category: 'Heritage', title: 'Amber Fort', desc: 'A majestic hilltop fort with stunning Rajput-Mughal architecture, mirrored halls, and panoramic views.' },
            { icon: '🔭', category: 'History', title: 'Jantar Mantar', desc: 'A UNESCO World Heritage astronomical observatory built in the 1720s, still accurate today.' },
            { icon: '🛍️', category: 'Shopping', title: 'Johari Bazaar', desc: 'Jaipur\'s famous gemstone market — emeralds, rubies, and handcrafted gold jewellery.' },
            { icon: '🍛', category: 'Food', title: 'Rajasthani Thali', desc: 'Dal Baati Churma, Laal Maas, Ghevar — a complete culinary exploration of Rajasthan.' }
        ],
        budgetKeys: { accommodation: 0.33, food: 0.25, transport: 0.20, activities: 0.22 }
    },

    kerala: {
        label: 'Alleppey (Kerala)',
        heroClass: 'bg-kerala',
        days: [
            {
                title: 'Arrival & Backwaters',
                morning: { title: 'Arrive & Board Houseboat', desc: 'Board your houseboat at Alleppey jetty. A certified cook will be on board for all your meals.' },
                afternoon: { title: 'Punnamada Lake', desc: 'Cruise through Punnamada Lake — the venue for Kerala\'s famous snake boat races. Watch local fishermen at work.' },
                evening: { title: 'Sunset on the Water', desc: 'Anchor at dusk on the canal. Watch the sun dip behind the coconut palms over the water.' }
            },
            {
                title: 'Village Canals',
                morning: { title: 'Small Canal Cruise', desc: 'Navigate the narrow village canals on a small punt boat. See village life — children heading to school, women washing clothes.' },
                afternoon: { title: 'Kuttanad Paddy Fields', desc: 'Visit the Kuttanad paddy fields — some of the lowest-altitude farming land in Asia, below sea level.' },
                evening: { title: 'Kerala Cuisine', desc: 'Enjoy a dinner of karimeen (pearl spot fish) pollichathu, cooked in banana leaf, served on board.' }
            },
            {
                title: 'Alappuzha Town & Beach',
                morning: { title: 'Alappuzha Beach', desc: 'Visit the old lighthouse and the beach pier. The pier stretching into the Arabian Sea is a popular walk.' },
                afternoon: { title: 'Krishnapuram Palace', desc: 'Tour the Krishnapuram Palace museum, with murals, sculptures, and Navarathri mandapam exhibits.' },
                evening: { title: 'Kathakali Show', desc: 'Attend a traditional Kathakali dance-drama performance in the evening — Kerala\'s ancient classical art form.' }
            }
        ],
        experiences: [
            { icon: '🚤', category: 'Water', title: 'Houseboat Cruise', desc: 'Spend a night drifting through Kerala\'s 900km backwater network on a traditional kettuvallam houseboat.' },
            { icon: '🐟', category: 'Food', title: 'Kerala Seafood', desc: 'Fish molee, prawn curry, karimeen pollichathu — Alleppey\'s coastal cuisine is exceptional.' },
            { icon: '🌴', category: 'Nature', title: 'Village Canal Rides', desc: 'Explore narrow village waterways by punt boat, passing paddy fields and coconut groves.' },
            { icon: '🎭', category: 'Culture', title: 'Kathakali Performance', desc: 'A classical dance-drama with intricate costumes and face paint telling stories from the Mahabharata.' }
        ],
        budgetKeys: { accommodation: 0.40, food: 0.25, transport: 0.15, activities: 0.20 }
    },

    agra: {
        label: 'Agra',
        heroClass: 'bg-agra',
        days: [
            {
                title: 'Taj Mahal at Sunrise',
                morning: { title: 'Taj Mahal — Sunrise Entry', desc: 'Enter before 6am for the most magical light. The white marble changes colour from pink to gold as the sun rises.' },
                afternoon: { title: 'Agra Fort', desc: 'Walk through Agra Fort, the massive red sandstone complex that was Shah Jahan\'s residence and later prison.' },
                evening: { title: 'Mehtab Bagh Moonrise', desc: 'Watch the Taj Mahal from Mehtab Bagh across the Yamuna River at dusk. A quieter, stunning angle.' }
            },
            {
                title: 'Fatehpur Sikri',
                morning: { title: 'Fatehpur Sikri Day Trip', desc: 'Drive 40km to the abandoned Mughal capital — a ghost city that was only inhabited for 14 years before being deserted.' },
                afternoon: { title: 'Return to Agra', desc: 'Return to Agra. Visit the Itimad-ud-Daulah (Baby Taj) — a smaller but exquisitely detailed marble mausoleum.' },
                evening: { title: 'Sadar Bazaar', desc: 'Agra is famous for marble inlay work and leather goods. The craftsmen near the Taj entrance demonstrate the pietra dura technique.' }
            }
        ],
        experiences: [
            { icon: '🕌', category: 'Heritage', title: 'Taj Mahal at Sunrise', desc: 'The world\'s most recognised monument is best seen in early morning light when few visitors are present.' },
            { icon: '🏯', category: 'Heritage', title: 'Agra Fort', desc: 'A UNESCO fortress complex with palaces, audience halls, and mosques, blending Mughal and Hindu architecture.' },
            { icon: '🏛️', category: 'History', title: 'Fatehpur Sikri', desc: 'A perfectly preserved abandoned Mughal city, 40km from Agra — one of India\'s most intriguing sites.' },
            { icon: '🔮', category: 'Craft', title: 'Marble Inlay Art', desc: 'Agra\'s craftsmen still use the same pietra dura technique used to build the Taj — a living heritage.' }
        ],
        budgetKeys: { accommodation: 0.32, food: 0.22, transport: 0.25, activities: 0.21 }
    },

    mumbai: {
        label: 'Mumbai',
        heroClass: 'bg-mumbai',
        days: [
            {
                title: 'Arrival & South Mumbai',
                morning: { title: 'Gateway of India', desc: 'Start at the iconic Gateway of India on Apollo Bunder. Watch the ferries to Elephanta Island depart.' },
                afternoon: { title: 'Colaba Causeway', desc: 'Browse the famous street market at Colaba Causeway — antiques, jewellery, clothes, and street snacks.' },
                evening: { title: 'Marine Drive Walk', desc: 'Walk the entire Marine Drive promenade at dusk. The "Queen\'s Necklace" lights up the bay as evening falls.' }
            },
            {
                title: 'Heritage & Culture',
                morning: { title: 'Elephanta Caves', desc: 'Take a ferry to Elephanta Island. The rock-cut caves contain ancient Shiva sculptures dating to the 5th century CE.' },
                afternoon: { title: 'Chhatrapati Shivaji Terminus', desc: 'Stand outside the UNESCO-listed railway station — a Victorian Gothic masterpiece still serving millions daily.' },
                evening: { title: 'Bandra & Juhu', desc: 'Head to Bandra for street food. Try vada pav, Mumbai\'s iconic street snack, followed by Juhu Beach at sunset.' }
            },
            {
                title: 'Local Neighbourhoods',
                morning: { title: 'Dharavi & Dabbawala Tour', desc: 'Join a responsible Dharavi walking tour, or witness the famous dabbawala lunchbox delivery system at work.' },
                afternoon: { title: 'Crawford Market & Chor Bazaar', desc: 'Visit Crawford Market for fresh produce and the Chor Bazaar for antiques, vintage items, and collectibles.' },
                evening: { title: 'Farewell Mumbai Night', desc: 'End with dinner at a sea-view restaurant in Worli or Bandra, overlooking the Bandra–Worli sea link.' }
            }
        ],
        experiences: [
            { icon: '🏛️', category: 'Heritage', title: 'Gateway of India', desc: 'The 1924 basalt arch monument overlooking the Arabian Sea — Mumbai\'s most iconic landmark.' },
            { icon: '🚢', category: 'History', title: 'Elephanta Caves', desc: 'UNESCO World Heritage Site — ancient rock-cut caves with monumental Shiva sculptures.' },
            { icon: '🍱', category: 'Culture', title: 'Dabbawala Experience', desc: 'The world-famous lunchbox delivery network, studied by Harvard Business School for its zero-error logistics.' },
            { icon: '🌊', category: 'Scenic', title: 'Marine Drive', desc: 'Mumbai\'s seafront promenade is spectacular at any hour — especially at the first light of dawn.' }
        ],
        budgetKeys: { accommodation: 0.38, food: 0.28, transport: 0.18, activities: 0.16 }
    },

    darjeeling: {
        label: 'Darjeeling',
        heroClass: 'bg-darjeeling',
        days: [
            {
                title: 'Tiger Hill Sunrise',
                morning: { title: 'Tiger Hill Before Dawn', desc: 'Wake at 4am for the drive to Tiger Hill. On clear days, you can see Kangchenjunga, the world\'s third highest peak.' },
                afternoon: { title: 'Tea Estate Tour', desc: 'Visit Happy Valley or Makaibari tea estate. Watch the tea leaves being picked, processed and tasted.' },
                evening: { title: 'Chowrasta Mall', desc: 'Stroll Chowrasta — Darjeeling\'s central promenade — with mountain ponies, toy shops, and sweet chai.' }
            },
            {
                title: 'Toy Train & Culture',
                morning: { title: 'Darjeeling Himalayan Railway', desc: 'Ride the UNESCO-listed Toy Train from Darjeeling to Ghoom. The narrow-gauge steam loop is a moving experience.' },
                afternoon: { title: 'Rock Garden & Gorkha Museum', desc: 'Visit the terraced Rock Garden, then the Gorkha Museum to understand Darjeeling\'s unique cultural heritage.' },
                evening: { title: 'Local Cuisine', desc: 'Momos, thukpa, and Darjeeling First Flush tea at a local restaurant — simple but deeply satisfying.' }
            }
        ],
        experiences: [
            { icon: '🌄', category: 'Nature', title: 'Tiger Hill Sunrise', desc: 'A pre-dawn pilgrimage that rewards with views of Kangchenjunga turning gold in the morning light.' },
            { icon: '🚂', category: 'Heritage', title: 'Toy Train Ride', desc: 'The Darjeeling Himalayan Railway — a UNESCO World Heritage site still operating steam locomotives.' },
            { icon: '🍃', category: 'Culture', title: 'Tea Estate Visit', desc: 'Walk through the terraced tea gardens and taste fresh Darjeeling tea right at its source.' },
            { icon: '🏔️', category: 'Scenic', title: 'Kangchenjunga View', desc: 'On clear mornings, Darjeeling offers an uninterrupted view of the world\'s third highest mountain.' }
        ],
        budgetKeys: { accommodation: 0.30, food: 0.26, transport: 0.22, activities: 0.22 }
    },

    andaman: {
        label: 'Andaman Islands',
        heroClass: 'bg-andaman',
        days: [
            {
                title: 'Arrival & Port Blair',
                morning: { title: 'Cellular Jail', desc: 'Start at the Cellular Jail National Memorial — a sobering reminder of India\'s freedom struggle under British colonialism.' },
                afternoon: { title: 'Corbyn\'s Cove Beach', desc: 'Relax at the closest beach to Port Blair. The calm sea is ideal for a first swim and settling in.' },
                evening: { title: 'Sound & Light Show', desc: 'The Cellular Jail hosts an emotional sound and light show every evening telling the story of India\'s independence movement.' }
            },
            {
                title: 'Havelock Island',
                morning: { title: 'Ferry to Havelock', desc: 'Take an early ferry to Havelock Island (Swaraj Dweep). Check in to your beach resort.' },
                afternoon: { title: 'Radhanagar Beach', desc: 'Visit Radhanagar Beach — consistently ranked among Asia\'s best beaches. The sunset here is extraordinary.' },
                evening: { title: 'Fresh Seafood Dinner', desc: 'Havelock has excellent beach-side restaurants serving grilled fish, squid, and coconut prawn curry.' }
            },
            {
                title: 'Snorkelling & Diving',
                morning: { title: 'Elephant Beach Snorkel', desc: 'Take a boat or trek to Elephant Beach for some of the Andaman\'s best coral snorkelling. Equipment is hired on-site.' },
                afternoon: { title: 'Glass Bottom Boat', desc: 'A glass-bottom boat tour shows you the coral reef without getting wet — perfect if you have non-swimmers in the group.' },
                evening: { title: 'Neil Island Ferry (optional)', desc: 'Day trip to the quieter Neil Island (Shaheed Dweep) for natural coral bridges and a slower pace.' }
            }
        ],
        experiences: [
            { icon: '🤿', category: 'Water', title: 'Snorkelling at Elephant Beach', desc: 'Crystal-clear water with vibrant coral reefs and colourful fish — one of India\'s best snorkelling spots.' },
            { icon: '🏖️', category: 'Beaches', title: 'Radhanagar Beach', desc: 'A sweeping bay with powder-white sand and turquoise water, consistently ranked in Asia\'s top beaches.' },
            { icon: '⛓️', category: 'History', title: 'Cellular Jail', desc: 'The notorious colonial prison where Indian freedom fighters were held — now a National Memorial.' },
            { icon: '🐠', category: 'Marine', title: 'Glass-Bottom Boat', desc: 'Explore the Andaman reef without diving — a tranquil way to see the marine world beneath the surface.' }
        ],
        budgetKeys: { accommodation: 0.40, food: 0.22, transport: 0.20, activities: 0.18 }
    },

    dubai: {
        label: 'Dubai',
        heroClass: 'bg-dubai',
        days: [
            {
                title: 'Arrival & Modern Dubai',
                morning: { title: 'Burj Khalifa', desc: 'Head to the Burj Khalifa early. The observation deck on the 124th floor offers an unmatched city panorama.' },
                afternoon: { title: 'Dubai Mall', desc: 'Explore the Dubai Mall — not just shopping but an aquarium, ice rink, and indoor waterfall.' },
                evening: { title: 'Dubai Fountain Show', desc: 'Watch the world\'s largest choreographed fountain dance to music at the base of the Burj Khalifa.' }
            },
            {
                title: 'Old Dubai & Souks',
                morning: { title: 'Gold Souk & Spice Souk', desc: 'Cross the Dubai Creek by abra (wooden boat) to explore the Gold Souk and the aromatic Spice Souk in Deira.' },
                afternoon: { title: 'Al Fahidi Historic District', desc: 'Walk the Al Fahidi neighbourhood — old wind-tower houses converted into art galleries and the Dubai Museum.' },
                evening: { title: 'Dubai Creek Dhow Dinner', desc: 'Board a traditional dhow boat for a dinner cruise along the illuminated Dubai Creek.' }
            },
            {
                title: 'Desert Safari',
                morning: { title: 'Miracle Garden or Museum of the Future', desc: 'Visit the Museum of the Future — a striking building with exhibits on AI, space, and sustainability.' },
                afternoon: { title: 'Desert Safari', desc: 'An afternoon desert safari with dune bashing, camel ride, sandboarding, and a camp with henna and dance.' },
                evening: { title: 'Bedouin Camp Dinner', desc: 'A traditional buffet under the stars in a Bedouin camp. Shisha, folk music, and a tanoura dance show.' }
            }
        ],
        experiences: [
            { icon: '🏙️', category: 'Iconic', title: 'Burj Khalifa', desc: 'The world\'s tallest building — an observation deck experience unlike anything else on earth.' },
            { icon: '🏜️', category: 'Adventure', title: 'Desert Safari', desc: 'Dune bashing, camel rides, sandboarding, and a Bedouin camp dinner under the stars.' },
            { icon: '⛵', category: 'Heritage', title: 'Dubai Creek Abra Ride', desc: 'A 1-dirham wooden boat crossing that has been connecting Old and New Dubai for generations.' },
            { icon: '🌹', category: 'Nature', title: 'Dubai Miracle Garden', desc: '150 million flowers arranged in incredible sculptures and designs — the world\'s largest natural flower garden.' }
        ],
        budgetKeys: { accommodation: 0.40, food: 0.25, transport: 0.17, activities: 0.18 }
    }
};

/* ================================================
   GENERIC FALLBACK ITINERARY
   For any destination not in the data above
   ================================================ */

function buildGenericDay(dayNum, destination) {
    const activities = [
        { m: 'Arrive & Explore', md: `Settle in and take a first walk around ${destination}. Visit the local market or main square to get your bearings.`, a: 'Key Attraction', ad: 'Head to the most celebrated landmark of the destination. Ask your hotel for their top recommendation.', e: 'Local Cuisine', ed: 'Try a local restaurant this evening. Ask for the dish the region is best known for.' },
        { m: 'Heritage Walk', md: 'Visit the historic quarter of the city. Look for museums, monuments, or old architecture that tells the story of the place.', a: 'Nature & Scenery', ad: 'Spend the afternoon in a park, garden, or natural attraction near the city.', e: 'Night Market', ed: 'Explore the local market or food street. Street food is often the most honest window into a culture.' },
        { m: 'Day Trip', md: 'Take a half-day excursion to a nearby attraction — a waterfall, hill station, or historic site usually within 1–2 hours.', a: 'Craft & Souvenirs', ad: 'Browse the artisan shops or local craft market. Look for items specific to the region.', e: 'Cultural Show', ed: 'Check if there\'s a folk performance, cultural show, or festival in the area this evening.' }
    ];
    const a = activities[(dayNum - 1) % activities.length];
    return {
        title: `Day ${dayNum} — ${destination}`,
        morning: { title: a.m, desc: a.md },
        afternoon: { title: a.a, desc: a.ad },
        evening: { title: a.e, desc: a.ed }
    };
}

const GENERIC_EXPERIENCES = [
    { icon: '🗺️', category: 'Explore', title: 'Key Landmark', desc: 'Visit the most celebrated site of your destination — ask locals what they\'re most proud of.' },
    { icon: '🍜', category: 'Food', title: 'Regional Cuisine', desc: 'Every destination has a signature dish. Make it a priority to eat like a local.' },
    { icon: '🛍️', category: 'Shopping', title: 'Local Market', desc: 'No trip is complete without browsing the local market — a direct window into daily life.' },
    { icon: '📸', category: 'Scenic', title: 'Sunset Viewpoint', desc: 'Find the best vantage point for golden hour — the light transforms any landscape.' }
];


/* ================================================
   UTILITY FUNCTIONS
   ================================================ */

function safeText(val, fallback = '') {
    if (!val) return fallback;
    const div = document.createElement('div');
    div.textContent = String(val);
    return div.innerHTML; // returns HTML-escaped version
}

/**
 * Parse an ISO date string (YYYY-MM-DD) as a **local** date, not UTC.
 * Using new Date('YYYY-MM-DD') treats it as UTC midnight, causing off-by-one
 * errors for users in timezones ahead of UTC (e.g. IST UTC+5:30).
 */
function parseLocalDate(isoDate) {
    if (!isoDate) return null;
    const parts = String(isoDate).split('-');
    if (parts.length !== 3) return new Date(isoDate);
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d); // local date, no UTC offset
}

function formatDate(isoDate) {
    if (!isoDate) return null;
    try {
        const d = parseLocalDate(isoDate);
        if (!d || isNaN(d.getTime())) return String(isoDate);
        return d.toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    } catch {
        return String(isoDate);
    }
}

function daysBetween(startISO, endISO) {
    try {
        const start = parseLocalDate(startISO);
        const end   = parseLocalDate(endISO);
        if (!start || !end || isNaN(start) || isNaN(end)) return 3;
        const ms   = end - start;
        const days = Math.round(ms / (1000 * 60 * 60 * 24));
        return days >= 1 ? days : 1;
    } catch {
        return 3; // sensible default
    }
}

function addDays(isoDate, n) {
    try {
        const d = parseLocalDate(isoDate);
        if (!d || isNaN(d.getTime())) return null;
        d.setDate(d.getDate() + n);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
        return null;
    }
}

function formatBudget(num) {
    if (!num || isNaN(num)) return null;
    return '₹' + Number(num).toLocaleString('en-IN');
}


/* ================================================
   RENDER FUNCTIONS
   ================================================ */

function renderOverview(trip, numDays) {
    const grid = document.getElementById('overviewGrid');
    const cards = [];

    cards.push({ icon: '📍', label: 'Destination', value: safeText(trip.destination, 'Unknown'), sub: '' });

    if (trip.startDate && trip.endDate) {
        const s = formatDate(trip.startDate);
        const e = formatDate(trip.endDate);
        cards.push({ icon: '📅', label: 'Travel Dates', value: `${s} – ${e}`, sub: `${numDays} day${numDays > 1 ? 's' : ''}` });
    } else {
        cards.push({ icon: '📅', label: 'Duration', value: `${numDays} day${numDays > 1 ? 's' : ''}`, sub: 'No specific dates set' });
    }

    const totalTravelers = (parseInt(trip.adults) || 2) + (parseInt(trip.children) || 0);
    const travelerText = totalTravelers === 1 ? '1 Traveller' : `${totalTravelers} Travellers`;
    const subParts = [];
    if (trip.adults) subParts.push(`${trip.adults} adult${trip.adults > 1 ? 's' : ''}`);
    if (trip.children && trip.children > 0) subParts.push(`${trip.children} child${trip.children > 1 ? 'ren' : ''}`);
    cards.push({ icon: '👥', label: 'Travellers', value: travelerText, sub: subParts.join(', ') });

    if (trip.budget) {
        cards.push({ icon: '💰', label: 'Budget', value: formatBudget(trip.budget), sub: trip.budgetStyle || 'Moderate style' });
    } else if (trip.budgetStyle) {
        cards.push({ icon: '💰', label: 'Budget Style', value: trip.budgetStyle, sub: 'No specific amount set' });
    }

    if (trip.accommodation) {
        cards.push({ icon: '🏨', label: 'Accommodation', value: trip.accommodation, sub: '' });
    }
    if (trip.transport) {
        cards.push({ icon: '🚗', label: 'Transport', value: trip.transport, sub: '' });
    }
    if (trip.pace) {
        cards.push({ icon: '⏱️', label: 'Travel Pace', value: trip.pace, sub: '' });
    }
    if (trip.interests && trip.interests.length > 0) {
        cards.push({ icon: '❤️', label: 'Interests', value: trip.interests.slice(0, 3).join(', '), sub: trip.interests.length > 3 ? `+${trip.interests.length - 3} more` : '' });
    }

    grid.innerHTML = cards.map(c => `
        <div class="overview-card">
            <div class="ov-icon">${c.icon}</div>
            <div class="ov-label">${c.label}</div>
            <div class="ov-value">${c.value}</div>
            ${c.sub ? `<div class="ov-sub">${safeText(c.sub)}</div>` : ''}
        </div>
    `).join('');
}

function renderDays(destData, trip, numDays) {
    const grid = document.getElementById('daysGrid');
    const sourcedays = destData ? destData.days : null;
    const html = [];

    for (let i = 0; i < numDays; i++) {
        let day;
        if (sourcedays && i < sourcedays.length) {
            day = sourcedays[i];
        } else if (sourcedays && sourcedays.length > 0) {
            // Cycle through template days when trip is longer than the template
            const tpl = sourcedays[i % sourcedays.length];
            day = Object.assign({}, tpl, {
                title: `Day ${i + 1} — ${tpl.title}`
            });
        } else {
            day = buildGenericDay(i + 1, trip.destination || 'your destination');
        }

        const dateLabel = trip.startDate ? addDays(trip.startDate, i) : null;
        const dateBadge = dateLabel ? `<span class="day-date-badge">${dateLabel}</span>` : '';

        html.push(`
            <article class="day-card">
                <div class="day-header">
                    <div>
                        <div class="day-number">DAY ${i + 1}</div>
                        <div class="day-title">${safeText(day.title)}</div>
                    </div>
                    ${dateBadge}
                </div>
                <div class="day-body">
                    <div class="time-slot">
                        <div class="time-label"><span class="time-dot"></span>Morning</div>
                        <h4>${safeText(day.morning.title)}</h4>
                        <p>${safeText(day.morning.desc)}</p>
                    </div>
                    <div class="time-slot">
                        <div class="time-label"><span class="time-dot noon"></span>Afternoon</div>
                        <h4>${safeText(day.afternoon.title)}</h4>
                        <p>${safeText(day.afternoon.desc)}</p>
                    </div>
                    <div class="time-slot">
                        <div class="time-label"><span class="time-dot eve"></span>Evening</div>
                        <h4>${safeText(day.evening.title)}</h4>
                        <p>${safeText(day.evening.desc)}</p>
                    </div>
                </div>
            </article>
        `);
    }

    grid.innerHTML = html.join('');
}

function renderExperiences(destData) {
    const grid = document.getElementById('experiencesGrid');
    const items = destData ? destData.experiences : GENERIC_EXPERIENCES;

    grid.innerHTML = items.map(exp => `
        <div class="experience-card">
            <div class="exp-icon-wrap">${exp.icon}</div>
            <div class="exp-body">
                <p class="exp-category">${safeText(exp.category)}</p>
                <h3>${safeText(exp.title)}</h3>
                <p>${safeText(exp.desc)}</p>
            </div>
        </div>
    `).join('');
}

function renderBudget(trip, numDays, destData) {
    const barsEl = document.getElementById('budgetBars');
    const totalCardEl = document.getElementById('budgetTotalCard');

    const rawBudget = parseFloat(trip.budget) || 0;
    const adults = parseInt(trip.adults) || 2;
    const children = parseInt(trip.children) || 0;
    const totalPeople = adults + children;

    // Determine base from budget or style
    let baseBudget = rawBudget;
    if (!baseBudget || baseBudget <= 0) {
        const style = (trip.budgetStyle || 'Moderate').toLowerCase();
        if (style === 'budget')   baseBudget = totalPeople * numDays * 2500;
        else if (style === 'luxury') baseBudget = totalPeople * numDays * 12000;
        else                      baseBudget = totalPeople * numDays * 5500;
    }

    const ratios = destData ? destData.budgetKeys : { accommodation: 0.35, food: 0.25, transport: 0.20, activities: 0.20 };

    const breakdown = [
        { icon: '🏨', name: 'Accommodation', ratio: ratios.accommodation, color: '#5c8a35', delayCls: '' },
        { icon: '🍜', name: 'Food & Dining', ratio: ratios.food, color: '#d47a2a', delayCls: 'delay1' },
        { icon: '🚗', name: 'Transport', ratio: ratios.transport, color: '#3a7abf', delayCls: 'delay2' },
        { icon: '🎯', name: 'Activities', ratio: ratios.activities, color: '#9b4ec9', delayCls: 'delay3' }
    ];

    const maxRatio = Math.max(...breakdown.map(b => b.ratio));

    barsEl.innerHTML = breakdown.map(b => {
        const amount = Math.round(baseBudget * b.ratio);
        const pct = Math.round((b.ratio / maxRatio) * 100);
        return `
            <div class="budget-bar-row">
                <div class="budget-bar-label">
                    <span class="bar-name">${b.icon} ${b.name}</span>
                    <span class="bar-amount">${formatBudget(amount)}</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill ${b.delayCls}" data-width="${pct}" style="background:${b.color};"></div>
                </div>
            </div>
        `;
    }).join('') + `<p class="budget-note">Estimates only — actual costs vary by season, availability, and personal choices.</p>`;

    const total = Math.round(baseBudget);
    const perPerson = totalPeople > 0 ? Math.round(total / totalPeople) : total;

    totalCardEl.innerHTML = `
        <div class="total-label">ESTIMATED TOTAL</div>
        <div class="total-amount">${formatBudget(total)}</div>
        <div class="total-per-person">≈ ${formatBudget(perPerson)} per person</div>
        <div class="total-breakdown">
            ${breakdown.map(b => `
                <div class="total-row">
                    <span>${b.icon} ${b.name}</span>
                    <span>${formatBudget(Math.round(baseBudget * b.ratio))}</span>
                </div>
            `).join('')}
        </div>
        <p class="total-disclaimer">Sample estimate only. Not a confirmed quote. Prices are illustrative and subject to change.</p>
    `;

    // Animate bars after a short delay (allows the layout to paint first)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.bar-fill').forEach(el => {
                el.style.width = el.dataset.width + '%';
            });
        });
    });
}

function renderHero(trip, destData) {
    const heroEl = document.getElementById('itineraryHero');
    const titleEl = document.getElementById('heroTitle');
    const metaEl = document.getElementById('heroMeta');
    const eyebrowEl = document.getElementById('heroEyebrow');

    // Background class
    if (destData && destData.heroClass) {
        heroEl.classList.add(destData.heroClass);
    } else {
        // Try to match a keyword in the destination name
        const dest = (trip.destination || '').toLowerCase();
        const bgMap = { kashmir: 'bg-kashmir', manali: 'bg-manali', goa: 'bg-goa', jaipur: 'bg-jaipur', kerala: 'bg-kerala', alleppey: 'bg-alleppey', agra: 'bg-agra', mumbai: 'bg-mumbai', darjeeling: 'bg-darjeeling', andaman: 'bg-andaman', dubai: 'bg-dubai' };
        for (const [key, cls] of Object.entries(bgMap)) {
            if (dest.includes(key)) { heroEl.classList.add(cls); break; }
        }
    }

    const destLabel = destData ? destData.label : (trip.destination || 'Your Destination');
    titleEl.textContent = `Your journey to ${destLabel}.`;

    eyebrowEl.textContent = 'YOUR PERSONALISED ITINERARY';

    const metaParts = [];
    if (trip.startDate && trip.endDate) {
        metaParts.push(`${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`);
    }
    const totalPeople = (parseInt(trip.adults) || 2) + (parseInt(trip.children) || 0);
    metaParts.push(`${totalPeople} traveller${totalPeople !== 1 ? 's' : ''}`);
    if (trip.budgetStyle) metaParts.push(`${trip.budgetStyle} budget`);
    metaEl.textContent = metaParts.join(' · ');

    document.title = `Itinerary — ${destLabel} | SAFAR`;
}


/* ================================================
   LOADING ANIMATION
   ================================================ */

function runLoadingAnimation(onComplete) {
    const lines = ['agentLine1', 'agentLine2', 'agentLine3', 'agentLine4'];
    let current = 0;

    function next() {
        if (current > 0) {
            document.getElementById(lines[current - 1]).classList.remove('active');
            document.getElementById(lines[current - 1]).classList.add('done');
        }
        if (current < lines.length) {
            document.getElementById(lines[current]).classList.add('active');
            current++;
            setTimeout(next, 620);
        } else {
            setTimeout(onComplete, 350);
        }
    }

    next();
}


/* ================================================
   MAIN INIT
   ================================================ */

function init() {
    // Read trip data from localStorage
    let trip = null;
    try {
        const raw = localStorage.getItem('safarTrip');
        if (raw) {
            trip = JSON.parse(raw);
        }
    } catch (e) {
        console.warn('SAFAR: Could not parse safarTrip from localStorage', e);
        trip = null;
    }

    // Fallback: if safarTrip doesn't exist but safarDestination does, build a minimal trip object
    if (!trip) {
        const dest = localStorage.getItem('safarDestination');
        if (dest && dest.trim()) {
            trip = { destination: dest.trim() };
        }
    }

    const overlay   = document.getElementById('loadingOverlay');
    const emptyPage = document.getElementById('emptyState');
    const mainPage  = document.getElementById('itineraryMain');

    if (!trip || !trip.destination) {
        // No data — show empty state
        overlay.classList.add('hidden');
        emptyPage.hidden = false;
        return;
    }

    // Safety net: if JS render throws, hide overlay after 6s so user isn't stuck
    const safetyTimer = setTimeout(() => {
        if (!overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
            emptyPage.hidden = false;
        }
    }, 6000);

    // Clean up emoji prefix from accommodation / transport / pace fields
    // (planner.js grabs the full button text including emoji e.g. "🏨 Hotel")
    function cleanPref(val) {
        if (!val) return val;
        // Remove all leading characters that are not ASCII letters or digits
        return val.replace(/^[^\w]+/, '').trim();
    }
    if (trip.accommodation) trip.accommodation = cleanPref(trip.accommodation);
    if (trip.transport)     trip.transport     = cleanPref(trip.transport);
    if (trip.pace)          trip.pace          = cleanPref(trip.pace);

    // Look up destination data
    const destKey = Object.keys(DESTINATION_DATA).find(key =>
        (trip.destination || '').toLowerCase().includes(key)
    );
    const destData = destKey ? DESTINATION_DATA[destKey] : null;

    // Determine number of days
    let numDays = 3;
    if (trip.startDate && trip.endDate) {
        numDays = Math.max(1, Math.min(daysBetween(trip.startDate, trip.endDate), 14));
    } else if (destData) {
        numDays = Math.min(destData.days.length, 5);
    }

    // Run the loading animation, then reveal the page
    runLoadingAnimation(() => {
        clearTimeout(safetyTimer);
        overlay.classList.add('hidden');
        mainPage.hidden = false;

        try {
            renderHero(trip, destData);
            renderOverview(trip, numDays);
            renderDays(destData, trip, numDays);
            renderExperiences(destData);
            renderBudget(trip, numDays, destData);
        } catch (err) {
            console.error('SAFAR: Error rendering itinerary', err);
        }
    });
}

// Kick off
init();
