# SAFAR — React Application & Travel Dashboard (`react-app`)

This directory contains the React frontend application for **SAFAR**, powered by [Vite](https://vite.dev/) and [React 19](https://react.dev/).

---

## 🌟 Overview & Features

- **My Travel Dashboard**:
  - **Dynamic Statistics**: Computes and displays total, upcoming, completed, and in-planning trips reactively.
  - **Status Category Filters**: Filter travel plans by status (*All*, *Upcoming*, *Completed*, *Planning*) with real-time counter pills.
  - **Interactive Trip Removal**: Remove trips dynamically with state updates (`.filter()`) that automatically update counts and statistics.
  - **Empty State Component**: Informative fallback UI when no trips match the selected filter, with an instant "Restore Sample Trips" button for repeatable practical demonstrations.
  - **Connected Navigation**: Connected with the main SAFAR home page (`index.html`), Explore page (`explore.html`), and Trip Planner (`planner.html`).
- **Preserved Root Project**: The existing HTML/CSS/JS website in the parent directory remains operational and preserved.
- **Unified SAFAR Theme**: Built with SAFAR's signature cream background (`#f8f8f3`), clean white panels, Playfair Display serif headings, DM Sans body typography, and olive/lime accents.

---

## 🔗 Connecting the Home Page to the React Dashboard

The SAFAR landing page [`../index.html`](../index.html) now includes a **My Dashboard** link in both its desktop navbar and mobile menu.

### How it works without hardcoding ports:
1. **Unified Vite Development (Recommended)**:
   - When running `npm run dev` inside `react-app/`, Vite serves both the React application (at `/`) and the parent static HTML pages (e.g. `/index.html`, `/explore.html`, `/planner.html`).
   - The link `href="react-app/"` uses relative routing and is automatically redirected to `/` (the React dashboard) on whatever dynamic port Vite is currently running (e.g. `5173`, `5174`, etc.).
2. **Separate Local Servers (e.g., Live Server + Vite)**:
   - If `index.html` is hosted on a static server (such as VS Code Live Server on port `5500`) while Vite is running on its own dev port, clicking `react-app/` loads `react-app/index.html`.
   - The fallback script in `react-app/index.html` dynamically detects the active Vite server and navigates to it, or displays an instruction card if the Vite server is not currently running.

---

## 🎓 React Concepts Demonstrated (College Web Tech Practical)

1. **Component-Based Architecture**: Separation of concerns across modular components (`Navbar`, `Dashboard`, `StatsOverview`, `CategoryFilter`, `TripList`, `TripCard`, `EmptyState`).
2. **State Management (`useState`)**: Managing active travel plans (`trips`), active filter selection (`activeFilter`), and view routing.
3. **Derived State**: Calculating trip statistics (`stats.total`, `stats.upcoming`, etc.) directly on every render without redundant variables.
4. **Props & Callback Functions**: Passing data downwards and passing event handler functions (`onRemoveTrip`, `onSelectFilter`, `onRestoreTrips`) upwards.
5. **Array Immutability & Methods**:
   - `.map()` for list rendering with stable `key` attributes.
   - `.filter()` for non-mutative status filtering and item deletion.
6. **Conditional Rendering**: Toggling between `<TripCard>` grid and `<EmptyState>` when no matching results exist.
7. **Responsive UI**: CSS grid and flexbox adapting across mobile, tablet, and desktop screens.

---

## 🚀 How to Run the Application

### 1. Open Terminal in `react-app`
```bash
cd react-app
```

### 2. Start the Vite Dev Server
```bash
npm run dev
```

### 3. Open in Browser
Visit:
```text
http://localhost:5173/
```

- **Open Travel Dashboard directly**: `http://localhost:5173/` or `http://localhost:5173/#dashboard`
- **Open Home Page with Dashboard link**: `http://localhost:5173/index.html`
- **Open Explore Destinations**: `http://localhost:5173/explore.html`
- **Open AI Trip Planner**: `http://localhost:5173/planner.html`

---

## 📦 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the local development server at `http://localhost:5173/` |
| `npm run build` | Builds the optimized production bundle into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs the linter to verify code cleanliness |
