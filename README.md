# 🌍 GeoGuide

**GeoGuide** is an AI-powered travel companion. It started life as a simple
country-information browser and has grown into a full-stack platform for
_exploring_ the world and _planning_ a trip through it — country data, live
weather and currency conversion, place discovery, personalized recommendations,
day-by-day itineraries, budget estimates, and a conversational travel assistant.
It installs like a native app and keeps working offline for the places you've
already explored.

It is built as a **React SPA backed by an Express API proxy**. Every third-party
integration (Google Gemini, Serpstack, OpenWeather, ExchangeRate-API) is called
_server-side_, so no API secret is ever shipped to the browser.

🔗 **Live demo:** [geoguide-nine.vercel.app](https://geoguide-nine.vercel.app/)

---

## ✨ Features

### Explore
- **Country directory** — search and filter every country by name, capital, or region, with a lazy-loaded, skeleton-driven grid and a floating _back to top_ control.
- **Country details** — flag, key facts, timezones, an interactive **Leaflet** map, **live weather** for the capital, an inline **currency converter**, and AI-written **travel insights**.
- **Location autocomplete** — every place field (itinerary, trip cost, recommendations) suggests countries instantly and cities as you type; free text still works.
- **Place discovery** — restaurants, hotels, attractions, museums, beaches and more near a destination, sourced via Serpstack, presented as a photography-first directory.

### Plan
- **Itinerary planner** — a personalized, day-by-day plan (morning / afternoon / evening, food, and getting around) rendered as an editorial timeline.
- **Trip cost estimator** — a scannable budget breakdown (flights, accommodation, food, transport, activities) with saving tips and alternative destinations, in the currency of your choice.
- **Recommendations ("For You")** — destination ideas tailored to your interests, budget, climate, and travel window.
- **Travel assistant** — a streaming, markdown-capable chat concierge for destinations, budgets, visas, and safety questions.

### Account
- **Google sign-in** (Firebase Auth) with a protected chat route and per-user data.
- **Saved trips** — bookmark countries, places, itineraries, and cost estimates; synced to Firestore and available across devices.
- **Profile** — account overview with saved-trip and conversation counts.

### Experience
- **Postcard design system** — a flat, colour-blocked travel look. Each page is a postcard in its own destination colour (**sea**, **sand**, **terracotta**, **olive**) with a perforated stamp, a postmark, and a simple illustrated scene. Self-hosted **Fraunces** (serif headings) + **Inter** (body), a warm paper background, and full light/dark theming.
- **Travel backdrop** — quiet, animated travel doodles (planes, compasses, suitcases, a dashed flight path) drift in the page margins and respond gently to the pointer. They stay out of the content column and stand still for reduced-motion users.
- **Responsive navigation** — a postcard navbar whose active link takes on that page's colour, collapsing into a menu on smaller screens (closes on navigation, <kbd>Esc</kbd>, or a tap outside). Pages always open at the top, clear of the navbar.
- **Graceful failure** — every failed network or API call shows a "returned to sender" postcard that says what went wrong and offers a retry. Broken images fall back to a styled placeholder, the map shows its own offline card, and unknown pages get a "This page isn't on the map" 404.
- **Accessibility first** — semantic landmarks, `aria` states on async and interactive UI, visible focus rings, a skip link, and a `prefers-reduced-motion` guard.

### Installable & offline (PWA)
- **Install it** — GeoGuide ships a web app manifest and stamp icons (including a maskable icon for Android), so it can be installed to a phone or desktop and opens in its own window. Chromium browsers get an **Install the app** button in the footer; on iPhone use **Share → Add to Home Screen**.
- **Works offline** — a Workbox service worker precaches the app shell, so every page opens without a connection. Countries, weather, exchange rates, places, and country insights you've already viewed stay readable offline (fresh data always wins when the network answers), along with map tiles, flags, and photos you've seen. AI generation (chat, itineraries, trip costs) always goes to the server.
- **Stays current** — when a new version is deployed, a postcard note offers **Reload** or **Later**, so nothing reloads out from under a half-filled form. A note also appears when the connection drops.

---

## 🏗️ Architecture

```
┌─────────────────────┐        /api/*        ┌──────────────────────────┐
│   React SPA (Vite)  │  ───────────────────▶ │   Express API (proxy)    │
│                     │   (Vite dev proxy /   │                          │
│  React Query        │    Vercel rewrites)   │  Zod-validated routes    │
│  Zustand · Router   │ ◀───────────────────  │  node-cache · rate-limit │
└─────────┬───────────┘        JSON / SSE     └────────────┬─────────────┘
          │                                                │
          │ Firebase SDK (public config)                   │ secret keys
          ▼                                                ▼
   Firebase Auth + Firestore                 Gemini · Serpstack ·
   (sign-in, saved trips, chats)             OpenWeather · ExchangeRate ·
                                             countries.dev
```

A **service worker** (generated by `vite-plugin-pwa`) sits between the SPA and
the network: it serves the precached app shell and answers read-only `GET`
requests from its cache when the network is slow or gone.

The browser only ever talks to Firebase (public-by-design config, guarded by
Firestore rules) and to the **internal `/api`** backend. All keyed third-party
services live behind Express, which validates input with **Zod**, caches
responses with **node-cache**, and throttles AI endpoints with
**express-rate-limit**.

---

## 🧰 Tech Stack

| Area | Technologies |
|------|--------------|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS 3 |
| **UI system** | class-variance-authority, tailwind-merge, clsx, @fontsource-variable (Fraunces + Inter), react-icons |
| **Data / state** | TanStack React Query, Zustand |
| **Routing** | React Router v6 |
| **Maps / content** | Leaflet + react-leaflet, react-markdown + remark-gfm |
| **PWA / offline** | vite-plugin-pwa (Workbox service worker, web app manifest) |
| **Auth / storage** | Firebase Auth + Firestore |
| **Backend** | Express 5, Zod, node-cache, express-rate-limit, Axios, tsx |
| **AI & services** | Google Gemini, Serpstack, OpenWeather, ExchangeRate-API, countries.dev |
| **Tooling** | ESLint, Vitest + Testing Library + jsdom, Concurrently |

---

## 📁 Project Structure

```
geoguide/
├── src/                      # React frontend
│   ├── api/                  # Frontend API clients (talk to /api)
│   ├── auth/                 # Auth context, guards, loading states
│   ├── components/           # Feature components (Chat, Places, Itinerary, …)
│   │   ├── Pwa/              # Update / offline notes
│   │   └── ui/               # Design system: Button, Card, postcard (Stamp,
│   │                         #   Scene, PostcardHeader), ErrorPostcard,
│   │                         #   SafeImage, TravelBackdrop, …
│   ├── constants/            # Shared constants & class strings
│   ├── hooks/                # React Query + feature hooks
│   ├── layouts/              # App shell (Header, Footer, Outlet)
│   ├── lib/                  # cn(), install prompt, other utilities
│   ├── pages/                # Routed pages
│   ├── services/firebase/    # Firestore-backed services (trips, chats)
│   ├── store/                # Zustand stores
│   ├── types/                # Shared TypeScript types & route map
│   └── test/                 # Vitest setup
├── server/                   # Express API proxy
│   ├── ai/                   # Gemini prompts + Zod response schemas
│   ├── config/               # Environment loading & integration flags
│   ├── lib/                  # HTTP client, cache, error helpers
│   ├── middleware/           # validate, rate-limit, error handling
│   ├── routes/               # /countries, /ai, /places, /weather, …
│   └── services/             # Gemini, Serpstack, Weather, Exchange, …
├── public/                   # Favicons and PWA icons
├── docs/                     # FIREBASE.md and other guides
├── firestore.rules           # Firestore security rules
├── vite.config.ts            # Vite, Vitest, and PWA / caching config
└── vercel.json               # SPA rewrites + service-worker cache headers
```

---

## 🔌 API Reference

All routes are mounted under `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | Service health check |
| `GET`  | `/api/countries` | List / look up countries |
| `GET`  | `/api/ai/country/:code` | AI travel insights for a country |
| `POST` | `/api/ai/chat` | Travel-assistant reply, streamed as **SSE** |
| `POST` | `/api/ai/itinerary` | Generate a day-by-day itinerary |
| `POST` | `/api/ai/recommendations` | Personalized destination recommendations |
| `GET`  | `/api/places` | Places near a location (by category) |
| `GET`  | `/api/locations?q=` | City / town suggestions for location autocomplete (Open-Meteo geocoding, keyless) |
| `POST` | `/api/travel-cost` | Estimate a trip budget |
| `GET`  | `/api/weather` | Current weather + forecast for a city |
| `GET`  | `/api/exchange/rates` | Currency exchange rates |
| `GET`  | `/api/exchange/convert` | Convert an amount between currencies |

> AI endpoints (`/api/ai/*`, `/api/travel-cost`) are rate-limited.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+**
- **Yarn** (classic)
- Optional (for AI/data features): API keys for Gemini, Serpstack, OpenWeather, and ExchangeRate-API, plus a Firebase project. The app degrades gracefully when a key is absent.

### 1. Clone & install
```bash
git clone https://github.com/sammy-code98/geoguide.git
cd geoguide
yarn
```

### 2. Configure environment
Copy the example file and fill in the values you have:
```bash
cp .env.example .env
```
See [Environment Variables](#-environment-variables) below and
[`docs/FIREBASE.md`](docs/FIREBASE.md) for Firebase setup.

### 3. Run in development
Run the frontend and backend together (recommended):
```bash
yarn dev:all
```
This starts Vite on **http://localhost:5173** and the Express API on
**http://localhost:5001**; Vite proxies `/api/*` to the backend automatically.

Or run them separately:
```bash
yarn dev        # frontend only
yarn dev:server # backend only (watch mode)
```

### 4. Build for production
```bash
yarn build
```

### 5. Try the PWA locally
The service worker only runs in a production build, not under `yarn dev`.
```bash
yarn build
yarn preview    # http://localhost:4173 (proxies /api to the backend)
```
Run `yarn dev:server` alongside it for API data. In Chrome DevTools,
**Application → Service workers** shows the worker, and the **Offline** checkbox
there lets you test the offline experience.

---

## 🔐 Environment Variables

Variables split cleanly into three groups (full annotated list in
[`.env.example`](.env.example)):

**Frontend (`VITE_` — safe to expose)**
| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | API base path (default `/api`) |
| `VITE_API_PROXY_TARGET` | Dev proxy target for the backend |
| `VITE_FIREBASE_*` | Firebase web config — **public by design**, guarded by Firestore rules |

**Backend (server-side only — never bundled)**
| Variable | Purpose |
|----------|---------|
| `PORT`, `NODE_ENV`, `CORS_ORIGIN` | Server runtime config |
| `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_MODEL_PRO` | Google Gemini |
| `SERPSTACK_API_KEY` | Place discovery |
| `OPENWEATHER_API_KEY` | Weather |
| `EXCHANGERATE_API_KEY` | Currency conversion |
| `REST_COUNTRIES_BASE_URL` | Country data source (countries.dev) |

> ⚠️ **Never commit `.env`.** Real secrets belong only to the backend and must
> never carry the `VITE_` prefix — anything prefixed `VITE_` is compiled into
> the browser bundle. The `VITE_FIREBASE_*` values are the sole exception: they
> are identifiers, not secrets.

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start the Vite dev server (frontend) |
| `yarn dev:server` | Start the Express API in watch mode |
| `yarn dev:all` | Run frontend + backend concurrently |
| `yarn server` | Run the Express API once (no watch) |
| `yarn build` | Type-check and build the frontend for production |
| `yarn preview` | Preview the production build locally (with the service worker) |
| `yarn lint` | Lint with ESLint (zero-warning policy) |
| `yarn typecheck:server` | Type-check the backend |
| `yarn test` | Run the test suite once |
| `yarn test:watch` | Run tests in watch mode |

---

## 🧪 Testing

Unit and component tests run on **Vitest** with **Testing Library** and
**jsdom** (frontend only — the Express server is excluded from the Vitest
include glob).

```bash
yarn test         # single run
yarn test:watch   # watch mode
```

---

## ☁️ Deployment

The app deploys to **Vercel**. [`vercel.json`](vercel.json) rewrites every
route to the SPA and serves `sw.js` and `manifest.webmanifest` with
`Cache-Control: no-cache`, so new deploys reach installed apps promptly.
Configure the same environment variables in your Vercel project settings,
keeping backend secrets out of any `VITE_`-prefixed key.

---

## 🔒 Security Notes

- **Secrets stay server-side.** The browser never receives a keyed integration
  credential — all such calls are proxied through Express.
- **Firebase web config is public by design.** Access is enforced by
  [`firestore.rules`](firestore.rules), not by hiding the config.
- **Input is validated** with Zod at the API boundary; AI routes are
  rate-limited; upstream responses are cached to reduce cost and latency.
- **The service worker caches only public, read-only data.** `POST` requests
  (AI generation, chat) are never cached, and Firebase traffic bypasses it.

---

## 📄 License

This project is released for educational and portfolio purposes.

## 👤 Author

Built by **[sammy-code98](https://github.com/sammy-code98)**.
