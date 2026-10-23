// SAMPLE DATA ONLY: these four trips are made up for the dashboard demo.
// They are NOT the trips you create in the planner.
// To add a trip, copy one { ... } block and give it a new id.

export const INITIAL_TRIPS = [
  {
    id: 'trip-1',
    destination: 'Manali, Himachal Pradesh',
    duration: '5 Days / 4 Nights',
    status: 'Upcoming',          // must be Upcoming, Completed or Planning (used by the filter buttons)
    category: 'Mountains',
    date: '15 Nov - 19 Nov 2026',
    description: 'Solang Valley, Rohtang Pass, pine forest trails and cosy mountain cafes.',
    budget: '₹18,500',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'trip-2',
    destination: 'Alleppey, Kerala',
    duration: '4 Days / 3 Nights',
    status: 'Upcoming',
    category: 'Nature',
    date: '02 Dec - 05 Dec 2026',
    description: 'A houseboat cruise along the palm-fringed backwaters.',
    budget: '₹14,200',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'trip-3',
    destination: 'Jaipur, Rajasthan',
    duration: '3 Days / 2 Nights',
    status: 'Completed',
    category: 'Culture',
    date: '10 Jan - 12 Jan 2026',
    description: 'Amer Fort, Hawa Mahal, City Palace and traditional craft bazaars.',
    budget: '₹11,000',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'trip-4',
    destination: 'Leh-Ladakh Expedition',
    duration: '7 Days / 6 Nights',
    status: 'Planning',
    category: 'Mountains',
    date: 'Target: Summer 2027',
    description: 'Pangong Tso, Khardung La pass, Nubra Valley and Buddhist monasteries.',
    budget: '₹35,000',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  }
]
