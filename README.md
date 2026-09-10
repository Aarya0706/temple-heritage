# 🛕 Temple Heritage

**A full-stack Next.js + Supabase platform for discovering Indian temples and planning AI-assisted pilgrimages.**

🔗 **[Live Demo](https://templeheritage.me/)** · **[GitHub Repo](https://github.com/Aarya0706/temple-heritage)**

---

## 📸 Screenshots

| Home | Itinerary | Planner |
|---|---|---|
| ![Home](./public/screenshots/home.png) | ![Itinerary](./public/screenshots/itinerary.png) | ![Planner](./public/screenshots/planner.png) |

---

## ✨ Key Features

* 🛕 **Explore Temples** — profiles with history, architecture, deity, festivals, and darshan info
* 🤖 **AI Yatra Planner** — Groq-powered, day-wise itinerary from city, days, region & interests; exports to PDF
* 🧠 **Temple Recommender** — personalized suggestions based on interests
* 📅 **Festival Calendar** — festivals linked to the temples that host them
* ♈ **Horoscope Finder** — zodiac-based temple discovery
* ❤️ **Saved Temples & My Yatras** — save temples and revisit generated itineraries
* 🏅 **Yatra Completion Badges** — completion streaks + region badges (North/South/East/West/Central India)
* 👨‍💼 **Admin Dashboard** — RLS-protected review moderation, platform stats, and usage charts
* 📜 **Pilgrimage Passport** — a running record of visits, exportable and shareable
* 💬 **Temple AI Assistant** — chat + voice Q&A about temples and planning
* ⭐ **Reviews & Photos** — ratings, written reviews, up to 3 compressed photos each

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────┐
│            Next.js App              │
│       React UI + App Router         │
└──────────────────┬──────────────────┘
                   │
          ┌────────┴─────────┐
          │                  │
          ▼                  ▼
   Next.js API Routes     Supabase
          │              Auth + Postgres
          │               + Storage
          │                  │
          ▼                  ▼
       Groq AI          User Content
          │
          ▼
  Validated AI Response
```

---

## 🛠️ Tech Stack

| Technology                  | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| **Next.js**                 | Full-stack React framework and application routing        |
| **React**                   | Frontend user interface                                   |
| **TypeScript**              | Type-safe application development                         |
| **Supabase**                | Authentication, PostgreSQL database, and storage          |
| **Groq SDK**                | AI-powered itinerary generation and assistant experiences |
| **Leaflet / React Leaflet** | Interactive map experiences                               |
| **jsPDF**                   | Downloadable itinerary generation                         |
| **Recharts**                | Data visualization and dashboard charts                   |
| **Lucide React**            | Interface icons                                           |
| **Vitest**                  | Automated tests                                           |

---

## 📂 Project Structure

```text
app/                 # Next.js routes, pages and API endpoints
components/          # Reusable UI components
data/                # Temple, festival and application data
lib/                 # Shared utilities and services
public/              # Static assets
scripts/             # Utility and development scripts
supabase/            # Supabase/database-related files

README.md             # Project documentation
package.json          # Dependencies and scripts
next.config.ts        # Next.js configuration
tsconfig.json         # TypeScript configuration
vitest.config.ts      # Vitest configuration
```

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Aarya0706/temple-heritage.git
cd temple-heritage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file using the variables required by the project and your Supabase/Groq setup.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

> Keep API keys and other secrets in environment variables. Never commit secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run Vitest tests
npm run test:watch   # Run tests in watch mode
```

---

## 🧠 AI Yatra Planning Pipeline

```text
User Preferences
       │
       ▼
┌──────────────────────┐
│ Starting City        │
│ Number of Days       │
│ Preferred Region     │
│ Personal Interests   │
└──────────┬───────────┘
           │
           ▼
     Temple Context
           │
           ▼
        Groq AI
           │
           ▼
    Structured JSON
           │
           ▼
  Validation & Parsing
           │
           ▼
 Response Normalization
           │
           ▼
  Personalized Yatra
           │
           ▼
 Downloadable Itinerary
```

The AI flow is designed to handle imperfect model output safely through validation, normalization, fallback handling, rate limiting, and error handling.

---

## 🔐 Engineering Highlights

Temple Heritage is built with a focus on practical application behavior, not just UI screens.

Key engineering aspects include:

* Server-side API routes
* Supabase authentication and persistence
* AI response validation and normalization
* Fallback handling for failed AI responses
* Rate limiting around AI functionality
* Client-side image optimization before upload
* Downloadable generated itineraries
* Automated testing with Vitest
* Responsive experiences for desktop and mobile

---

## 🌐 Deployment

The application is deployed on **Vercel**.

🔗 **Live:** https://templeheritage.me/

---

## 🗺️ Roadmap

Future improvements can include:

* 🗺️ More advanced pilgrimage route optimization
* 🚗 Travel-distance and transport-aware planning
* 🔔 Festival and pilgrimage notifications
* 📍 Broader temple coverage across India
* 🌐 Expanded multilingual experiences
* 📊 More advanced recommendation models
* 👨‍💼 Deeper admin analytics (retention, cohort views)

---

## 👩‍💻 Author

**Aarya Shirsath**
Developer & Creator of Temple Heritage

---

## 🌸 Why I Built This

India's temples carry centuries of history, architecture, and tradition, but that information is scattered across guidebooks, forums, and word of mouth. Temple Heritage brings it into one place and pairs it with AI-assisted planning, so discovering a temple's story and actually planning a visit aren't two separate efforts.

---

⭐ **Explore the live project:** https://templeheritage.me/
