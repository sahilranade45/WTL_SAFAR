# SAFAR – Practical Exam Cheat Sheet (`simple-safar` branch)

SAFAR is an AI travel planner. You fill in a form, the server asks Google Gemini to write an itinerary, and the page shows it.
This branch is the **simple version** of the same project. The full original is still on the `main` branch.

---

## 1. How to run

You need Python 3 and Node.js. Open **two terminals** in the project folder (`WTL SAFAR`).

### Terminal 1 – the website + backend (port 8000)

First time only:

```powershell
cd backend
python -m venv .venv                       # skip if the .venv folder already exists
.venv\Scripts\python -m pip install -r requirements.txt
copy .env.example .env                     # then open .env and paste your Gemini key
```

Every time:

```powershell
cd backend
.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

Open **http://localhost:8000** in the browser. (Do not double-click the HTML files. The itinerary page needs the server.)

What goes in `backend/.env` (never share or commit this file):

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash
```

Get a free key at https://aistudio.google.com/app/apikey

### Terminal 2 – the React dashboard (port 5173)

```powershell
cd react-app
npm install          # first time only
npm run dev
```

Open **http://localhost:5173**. The "Dashboard" link in the website's navbar goes there, so start this terminal first if you want to click it.

---

## 2. What each file does

| File | One-line job |
|---|---|
| `backend/main.py` | The FastAPI server: the Gemini route **and** it serves the `frontend/` pages. |
| `backend/requirements.txt` | The Python packages to install. |
| `backend/.env.example` | A template for `.env` (the real `.env` holds your secret key and is ignored by Git). |
| `frontend/index.html` | Home page. |
| `frontend/script.js` | Home page script: the `startPlanning()` button function. |
| `frontend/explore.html` | Explore page layout (search box, filter buttons, empty grid). |
| `frontend/explore.js` | Holds the destinations list, builds the cards, filters and searches. |
| `frontend/planner.html` | The one trip form. |
| `frontend/planner.js` | Reads the form, validates it, saves the trip, goes to the itinerary page. |
| `frontend/itinerary.html` | Result page layout (status box + empty result area). |
| `frontend/itinerary.js` | Sends the trip to the backend with `fetch` and draws the answer. |
| `frontend/style.css` | The only stylesheet for all five pages. |
| `react-app/index.html` | The page React draws into (`<div id="root">`). |
| `react-app/src/main.jsx` | Starts React: puts `<App />` into the root div. |
| `react-app/src/App.jsx` | Navbar + `<Dashboard />` + footer. |
| `react-app/src/components/Dashboard.jsx` | The trip list with state, filter buttons, remove and restore. |
| `react-app/src/components/TripCard.jsx` | One trip card (shows how props work). |
| `react-app/src/data/sampleTrips.js` | Four **sample** trips (not real data). |
| `react-app/src/App.css` | The only stylesheet for the dashboard. |
| `react-app/vite.config.js` | Vite settings (React plugin, port 5173). |

---

## 3. How the app works (request flow)

1. You open `http://localhost:8000`. **FastAPI** serves the files from `frontend/` (`main.py:146`).
2. You click **Plan My Trip** (`index.html:46`), which calls `startPlanning()` (`script.js:5`) and opens `planner.html`.
3. You fill the form and press **Generate My Trip**. The `submit` event runs (`planner.js:55`). `event.preventDefault()` stops a page reload.
4. `validateForm()` (`planner.js:32`) checks the trip. If something is wrong, the message is shown in `#formError` and the code stops.
5. If it is valid, the trip is saved with `localStorage.setItem("safarTrip", ...)` (`planner.js:68`) and the browser goes to `itinerary.html` (`planner.js:69`).
6. `loadItinerary()` (`itinerary.js:61`) reads the saved trip and sends it with `fetch` as a **POST** with a JSON body (`itinerary.js:74`).
7. The route `generate_itinerary` (`main.py:97`) receives it. **Pydantic** (`ItineraryRequest`, `main.py:44`) checks the types. The code checks the dates, builds a prompt (`build_prompt`, `main.py:55`) and calls **Gemini** with the secret key.
8. Gemini replies with JSON text. The server turns it into a dictionary and returns `{"itinerary": {...}}`.
9. `showItinerary()` (`itinerary.js:28`) builds the day cards with `createElement` and `textContent` and puts them on the page.
10. If Gemini fails (busy, wrong key, quota ...), the server returns an error with a clear message and `showStatus()` (`itinerary.js:21`) shows it in red. **No fake itinerary is ever shown.**

The API key lives only in `backend/.env`. The browser never sees it.

---

## 4. Important functions, variables, routes

| Name | Where | What it does |
|---|---|---|
| `POST /api/generate-itinerary` | `main.py:96` | The only API route: trip in, itinerary out. |
| `app.mount("/", StaticFiles(...))` | `main.py:146` | Serves `frontend/` only. `.env` and `main.py` can't be downloaded. It must stay the **last** line. |
| `ItineraryRequest` | `main.py:44` | The list of fields the browser must send (and their rules). |
| `build_prompt()` | `main.py:55` | Makes the text instruction for Gemini. |
| `explain_gemini_error()` | `main.py:79` | Turns Gemini error codes (401/403/404/429/503) into readable messages. |
| `GEMINI_API_KEY`, `GEMINI_MODEL`, `MAX_DAYS` | `main.py:33-35` | Settings. Key and model come from `.env`. |
| `readTrip()` | `planner.js:14` | Collects the form values into one object. |
| `validateForm()` | `planner.js:32` | Returns an error message, or `""` if all is fine. |
| `loadItinerary()` | `itinerary.js:61` | Reads trip, calls the API, shows result or error. |
| `makeElement()` | `itinerary.js:13` | Small helper: make a tag and put safe text inside. |
| `API_URL` | `itinerary.js:4` | The address the page calls. |
| `destinations` | `explore.js:4` | The array of places. |
| `createCard()` | `explore.js:28` | Builds one destination card. |
| `showDestinations()` | `explore.js:66` | Filters the array and redraws the grid. |
| `safarTrip` | `planner.js:68`, `itinerary.js:63` | The `localStorage` key that carries the trip between pages. |
| `Dashboard`, `TripCard`, `App` | `Dashboard.jsx:9`, `TripCard.jsx:4`, `App.jsx:8` | The three React components. |
| `trips`, `activeFilter` | `Dashboard.jsx:11-12` | The two pieces of React state. |

---

## 5. "The examiner says… → change this"

Line numbers are for the files as committed on this branch.

| Examiner says | File : line | What to type |
|---|---|---|
| Change the **page title** (browser tab) | `frontend/index.html:6` | Edit the text inside `<title>…</title>`. Other pages: `planner.html:6`, `explore.html:6`, `itinerary.html:6`. |
| Change the **main heading** | `frontend/index.html:39` | Edit `<h1>Plan less.<br><span>Travel more.</span></h1>`. Planner heading: `planner.html:25`. |
| Change a **button's text** | `frontend/index.html:46` | Change `Plan My Trip`. Submit button: `planner.html:70` (`Generate My Trip`). |
| Change an **input placeholder** | `frontend/planner.html:33` | Change `placeholder="Search a city or country..."`. Search box: `explore.html:33`. |
| Change a **validation message** | `frontend/planner.js:34` | Edit the sentence in quotes. Others: lines 37, 40, 46, 49. |
| Change a **validation limit** | `frontend/planner.js:4-6` | `MIN_DESTINATION_LENGTH`, `MAX_TRAVELERS`, `MAX_DAYS`. Also change `main.py:35` (`MAX_DAYS`) and `planner.html:47` (`max="20"`) so they agree. |
| Change the **main colour** | `frontend/style.css:5` | `--main: #172c27;` → e.g. `#1d4ed8`. Everything dark green changes. |
| Change the **background colour** | `frontend/style.css:7` | `--bg: #f7f6f2;` |
| Change the **text colour** | `frontend/style.css:8` | `--text: #18201c;` |
| Change the **accent (lime) colour** | `frontend/style.css:6` | `--accent: #d7ff64;` |
| Change **card size** | `frontend/style.css:12` | `--card-width: 300px;` (smaller = more columns). Image height: `style.css:195` (`height: 200px`). |
| Change **number of grid columns** | `frontend/style.css:171` | Replace the value with a fixed number: `grid-template-columns: repeat(3, 1fr);` |
| Change **layout direction** | `frontend/style.css:105` | Hero: `flex-direction: column` → `row`. Phone navbar: line 431. |
| Change the **mobile breakpoint** | `frontend/style.css:429` | `@media (max-width: 700px)` → another number. |
| Change a **hover effect** | `frontend/style.css:86` (button), `:182` (card) | Edit the colours or `box-shadow` / `transform` inside. |
| Change **sticky navbar** (position) | `frontend/style.css:47` | `position: sticky;` → `fixed` or `static`. |
| Change the **backend port** | the run command | `--port 8000` → `--port 9000`. Then also change the URL in `itinerary.js:90` (message text) and `SITE_URL` in `react-app/src/App.jsx:5`. |
| Change the **API URL** | `frontend/itinerary.js:4` | `const API_URL = "/api/generate-itinerary";` and the route name at `backend/main.py:96`. |
| Change the **Gemini model** | `backend/.env` | `GEMINI_MODEL=...` (default in `main.py:34`). Restart the server. |
| Change the **React port** | `react-app/vite.config.js:8` | `server: { port: 5173 }` |
| Change the **React filter buttons** | `react-app/src/components/Dashboard.jsx:7` | Edit the `FILTERS` array. |
| Change **sample trips** | `react-app/src/data/sampleTrips.js` | Edit or copy a `{ ... }` block. |
| Add a **new destination card** | `frontend/explore.js:4-14` | Copy one `{ name: ..., state: ... }` line and edit it. |

### How to add a new form field (example: "Travel pace")

You need to touch **four places**. Nothing else needs to change, because `itinerary.js` sends the whole trip object as it is.

| Step | File : line | What to add |
|---|---|---|
| 1. Form input | `frontend/planner.html` (after the budget `<select>` that ends at line 54) | `<label for="pace">Travel pace</label>` and `<select id="pace"><option>Relaxed</option><option>Packed</option></select>` |
| 2. Read it | `frontend/planner.js:27` (next to `interests`, inside the `return { … }` of `readTrip`) | `pace: document.getElementById("pace").value,` |
| 3. Accept it on the server | `backend/main.py:52` (inside `ItineraryRequest`) | `pace: str = "Relaxed"` |
| 4. Use it in the prompt | `backend/main.py:74` (the "Trip details" list) | `- Pace: {trip.pace}` |

For a **required** field, also add a check in `validateForm()` (`planner.js:32`). Restart the server after editing `main.py` (`--reload` does it for you).

---

## 6. Practical → where it is shown

Practical numbers are from your lab manual index (Web Technologies 102606).

| # | Practical | Shown in |
|---|---|---|
| 1 | Headings, lists, images | `index.html`: `<h1>` (39), `<h2>`, `<h3>`, `<ol>` (53), `<ul>` (114), `<img>` with `src` `alt` `width` `height` (70-71) |
| 2 | Semantic HTML | `index.html`: `<header>` (25), `<nav>` (27), `<main>` (35), `<section>` (38), `<article>`, `<footer>` (113); form with `<label>` in `planner.html` |
| 3 | Inline, internal, external CSS | External: `<link … style.css>` (`index.html:12`). Internal: `<style>` (`index.html:15`). Inline: `style="…"` (`index.html:64`) |
| 4 | Flexbox, Grid, media queries | Flexbox: `style.css:40-50` (navbar). Grid: `style.css:171`. Media query: `style.css:429` |
| 5 | CSS positions and other properties | `sticky`: `style.css:47`. `relative`/`absolute`: `style.css:189` and `:200`. `z-index`: `:49`, `:203`. `box-shadow`: `:183`. Also margin, padding, border, width, height, background |
| 6 | Link JS file, events, array functions | `script.js` (`onclick`, `index.html:46`). `explore.js`: `filter` (68), `forEach` (76), `addEventListener` (84, 90) |
| 7 | Front-end features, form validation | `planner.js`: `validateForm` (32), `submit` + `preventDefault` (55-56), limits (4-6) |
| 8 | React SPA, functional components, JSX | `react-app/src/App.jsx`, `Dashboard.jsx`, `TripCard.jsx` |
| 9 | React props, state, hooks, events, conditional rendering | Props: `TripCard.jsx:4`. State: `Dashboard.jsx:11-12`. `useEffect`: `Dashboard.jsx:16`. Events: `onClick` (`Dashboard.jsx:59`). Conditional: `Dashboard.jsx:67` |
| 10 | Fetch and JSON from an API | `itinerary.js:74` (`fetch` POST), `JSON.stringify` (77), `response.json()` |
| 11 | DOM manipulation, events | `explore.js:28` (`createElement`, `append`), `itinerary.js:28` (`showItinerary`), `textContent` |
| 12 | PHP: forms, sessions | **Not covered.** This project has no PHP. |
| 13 | PHP + MySQL CRUD | **Not covered.** No PHP, no database. |
| 14 | Node + Express server, routing, static files | **Not covered with Node/Express.** The same ideas exist in **FastAPI (Python)**: server, routes (`main.py:96`), static files (`main.py:146`). |
| 15 | REST API with Node, Express, database | **Not covered.** There is a REST API (`POST /api/generate-itinerary`) in FastAPI, but no Node, Express or database. |
| 16 | Course project | SAFAR as a whole. The brief also mentions MySQL and CRUD; **this project has neither.** |

---

## 7. Likely viva questions

**HTML / CSS**

- **What is semantic HTML?** Tags that describe their meaning (`header`, `nav`, `main`, `section`, `footer`) instead of many plain `div`s. Better for readability, SEO and screen readers.
- **Inline vs internal vs external CSS?** Inline = `style="..."` on one tag. Internal = a `<style>` block in one page. External = a `.css` file linked with `<link>` (best: reused by all pages). We use all three on `index.html`.
- **What are CSS variables?** Values like `--main` defined in `:root` and used with `var(--main)`. Change once, the whole site changes (`style.css:4-13`).
- **Flexbox vs Grid?** Flexbox lays things out in one direction (the navbar row). Grid does rows and columns (the card grid).
- **What does a media query do?** Applies CSS only when a condition is true, here a screen up to 700px wide (`style.css:429`).
- **Position values?** `static` (default), `relative`, `absolute` (placed inside the nearest relative parent: the card tag), `fixed`, `sticky` (the navbar sticks while scrolling).

**JavaScript**

- **What is the DOM?** The browser's tree of the page that JavaScript can read and change.
- **What does `addEventListener` do?** Runs a function when an event (click, submit, input) happens.
- **What does `preventDefault()` do?** Stops the browser's default action, here reloading the page on form submit (`planner.js:56`).
- **`map`, `filter`, `forEach`?** `filter` keeps items that pass a test (`explore.js:68`). `forEach` runs code for each item. `map` turns each item into something new (`itinerary.js` builds cards).
- **`textContent` vs `innerHTML`?** `textContent` puts plain text, so it is safe. `innerHTML` would run HTML from the text, which allows XSS attacks. We use `textContent` everywhere.
- **What is `fetch`? What is a Promise?** `fetch` sends an HTTP request. It returns a Promise (a value that arrives later). `await` waits for it inside an `async` function (`itinerary.js:61`).
- **What is JSON?** A text format for data (`{"name": "Goa"}`). `JSON.stringify` turns an object into text and `response.json()` turns text into an object.
- **What is `localStorage`?** Browser storage that keeps text between pages. We use it to carry the trip from the planner to the itinerary page.

**React**

- **What is a component?** A function that returns JSX. `App`, `Dashboard` and `TripCard` are components.
- **What is JSX?** HTML-like syntax inside JavaScript.
- **What are props?** Inputs passed from parent to child. `Dashboard` gives `trip` and `onRemove` to `TripCard` (`Dashboard.jsx:70`).
- **What is state / `useState`?** Data React remembers. When you call `setTrips(...)`, React redraws the page (`Dashboard.jsx:11`).
- **What is `useEffect`?** Code that runs after the page is drawn, and again when its dependencies change. Ours updates the tab title when `trips` changes (`Dashboard.jsx:16`).
- **Why `key` in a list?** So React can tell the items apart (`key={trip.id}`).
- **What is conditional rendering?** Showing different JSX depending on a condition (cards or "No trips" message, `Dashboard.jsx:67`).
- **What is Vite?** The tool that runs the React dev server and builds the app.

**Backend / API**

- **What is FastAPI?** A Python web framework. A function with `@app.post("/path")` becomes an API route.
- **What is REST? GET vs POST?** REST = using URLs and HTTP methods for resources. GET reads data. POST sends data to be processed (we POST the trip).
- **What is Pydantic?** It checks incoming JSON against a class (`ItineraryRequest`). A wrong request gets status **422** automatically.
- **Status codes used?** 200 OK, 400 bad request (bad dates), 422 invalid data, 502 Gemini failed, 503 key missing.
- **Why must the API key stay on the server?** Anything in browser JavaScript can be read by anyone. The key is in `backend/.env`, ignored by Git, and never sent to the browser.
- **How are static files served?** `StaticFiles` mounted at `/` (`main.py:146`) serves only the `frontend/` folder. Other folders like `backend/` are not reachable.
- **Why no CORS setup?** The pages and the API come from the same address (`localhost:8000`), so the browser allows the call. (The original needed CORS because the pages ran on another port.)
- **Which Node/Express/PHP/MySQL parts exist?** None. The backend is Python/FastAPI and there is no database. Say this honestly.

---

## 8. What changed compared with `main`

| Original (`main`) | This branch |
|---|---|
| Itinerary came from 350 lines of **hard-coded templates**; the backend was never called | `itinerary.js` calls the real backend with `fetch`, and the backend calls Gemini |
| Planner = 5-step wizard (642 lines HTML, 544 lines JS) | One form (84 lines HTML, 76 lines JS) |
| Fake "AI Agents" section and fake loading animation | Removed (they did nothing) |
| 6 CSS files (about 4,300 lines), no variables | One `style.css` with colour variables |
| Destination detail page + duplicate `destinaton.js` (typo) | Removed. Explore cards link straight to the planner |
| Inspiration page (HTML, CSS, JS) | Removed |
| Log in button, mobile menu, scroll animation, port-detection hack | Removed |
| `backend/main.py` had 405 lines: retries, fallback model (the fallback `gemini-2.5-flash` no longer exists for new keys), debug mode, CORS, logging | 146 lines: one Gemini call, clear error messages, serves the frontend |
| Backend was **not tracked in Git** | Original backup commit on `main`: `chore: add original FastAPI backend` |
| Two servers needed (Live Server + uvicorn) | One server: `http://localhost:8000` |
| React: `App` + 7 components, 2 CSS files, hash routing, custom Vite middleware, lint tool | React: `App` + 2 components (`Dashboard`, `TripCard`), one CSS file, plain Vite config |
| Default Gemini model `gemini-3.8-flash` (returned 503/504 on every test call) | Default `gemini-3.5-flash` (returned itineraries in my tests, but also had an occasional 503, so a retry may be needed) |

Kept: plain HTML/CSS/JS, React + Vite, FastAPI + Gemini, file names (`index`, `explore`, `planner`, `itinerary`, `script.js` ...), colours, fonts, the destinations and the SAFAR look.

To see the old version at any time: `git checkout main` (and `git checkout simple-safar` to come back).

---

## 9. If something goes wrong

| What you see | Reason | Fix |
|---|---|---|
| "Could not reach the backend" | The server is not running, or you opened the HTML file directly | Start Terminal 1 and open `http://localhost:8000` |
| "Gemini is busy or timed out (error 503)" | Google's model is overloaded (it is not a bug in the code) | Wait a minute and press **Plan Another Trip**, or set a different `GEMINI_MODEL` in `.env` and restart |
| "Gemini rejected the API key" | Wrong or missing key | Fix `GEMINI_API_KEY` in `backend/.env` and restart |
| "Gemini model '…' was not found" (404) | Model name is wrong or retired | Fix `GEMINI_MODEL` in `backend/.env` |
| "Gemini quota or rate limit reached" (429) | Too many requests | Wait and retry |
| Dashboard link opens an error page | React server is not running | Start Terminal 2 |
| Changed `.env` but nothing changed | The server reads `.env` only at start | Stop the server (Ctrl+C) and start it again |
