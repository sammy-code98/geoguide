# 🌍 GeoGuide

**GeoGuide** is an AI-powered travel companion. It started life as a simple
country-information browser and has grown into a full-stack platform for
_exploring_ the world and _planning_ a trip through it — country data, live
weather and currency conversion, place discovery, personalized recommendations,
day-by-day itineraries, budget estimates, and a conversational travel assistant.

It is built as a **React SPA backed by an Express API proxy**. Every third-party
integration (Google Gemini, Serpstack, OpenWeather, ExchangeRate-API) is called
_server-side_, so no API secret is ever shipped to the browser.

🔗 **Live demo:** [geoguide-five.vercel.app](https://geoguide-five.vercel.app/)

---

## ✨ Features

### Explore
- **Country directory** — search and filter every country by name, capital, or region, with a lazy-loaded, skeleton-driven grid and a floating _back to top_ control.
- **Country details** — flag, key facts, timezones, an interactive **Leaflet** map, **live weather** for the capital, an inline **currency converter**, and AI-written **travel insights**.
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
- **Editorial design system** — a calm, premium travel aesthetic: self-hosted **Fraunces** (serif headings) + **Inter** (body), a deep-**teal + warm-stone** token palette, borders over shadows, and full light/dark theming.
- **Accessibility first** — semantic landmarks, `aria` states on async and interactive UI, visible focus rings, a skip link, and a `prefers-reduced-motion` guard.

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
│   │   └── ui/               # Design-system primitives (Button, Card, Badge, …)
│   ├── constants/            # Shared constants & class strings
│   ├── hooks/                # React Query + feature hooks
│   ├── layouts/              # App shell (Header, Footer, Outlet)
│   ├── lib/                  # cn() and other utilities
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
├── docs/                     # FIREBASE.md and other guides
├── firestore.rules           # Firestore security rules
└── vercel.json               # Deployment / rewrites
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
| `POST` | `/api/travel-cost` | Estimate a trip budget |
| `GET`  | `/api/weather` | Current weather + forecast for a city |
| `GET`  | `/api/exchange` | Currency exchange rates |

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
| `yarn preview` | Preview the production build locally |
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

The app deploys to **Vercel** ([`vercel.json`](vercel.json) handles routing and
`/api` rewrites). Configure the same environment variables in your Vercel
project settings, keeping backend secrets out of any `VITE_`-prefixed key.

---

## 🔒 Security Notes

- **Secrets stay server-side.** The browser never receives a keyed integration
  credential — all such calls are proxied through Express.
- **Firebase web config is public by design.** Access is enforced by
  [`firestore.rules`](firestore.rules), not by hiding the config.
- **Input is validated** with Zod at the API boundary; AI routes are
  rate-limited; upstream responses are cached to reduce cost and latency.

---

## 📄 License

This project is released for educational and portfolio purposes.

## 👤 Author

Built by **[sammy-code98](https://github.com/sammy-code98)**.
