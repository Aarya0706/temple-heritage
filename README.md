# 🛕 Temple Heritage

### Discover India's Sacred Heritage Through Technology

**Temple Heritage** is a modern web platform for exploring India's temples, festivals, cultural heritage, and pilgrimage experiences. It combines curated temple information with personalized discovery and AI-assisted yatra planning to help users move from **exploring a temple to planning a journey**.

🔗 **Live Application:** https://temple-heritage-fawn.vercel.app/

---

## ✨ What You Can Do

### 🛕 Explore Temples

Browse temple profiles with useful information about:

* History and cultural significance
* Architecture and traditions
* Deity and spiritual importance
* Location and region
* Associated festivals
* Visitor and darshan information

### 🤖 AI Yatra Planner

Create a personalized pilgrimage itinerary using:

* 📍 Starting city
* 📅 Number of travel days
* 🗺️ Preferred region
* ❤️ Personal interests

The planner uses **Groq AI** to generate a structured, day-wise itinerary and turns the result into a downloadable travel plan.

### 🧠 Temple Recommender

Get personalized temple suggestions based on interests and preferences, making it easier to discover places beyond simple browsing.

### 📅 Festival Calendar

Explore temple festivals and cultural celebrations and discover temples associated with them.

### 🕉️ Darshan Information

Access temple-specific darshan and visitor information while planning a visit.

### ♈ Horoscope Finder

Discover temples through a zodiac-based experience for users who want a more personalized way to explore sacred places.

### ❤️ Saved Temples & My Yatras

Authenticated users can save temples and revisit their generated pilgrimage journeys from their personal space.

### 📜 Pilgrimage Passport

Keep a personal record of your temple exploration and turn individual visits into an ongoing pilgrimage journey.

### 💬 Temple AI Assistant

Ask questions about temples and pilgrimage planning through the built-in AI assistant, including voice-input support.

### ⭐ Reviews & Visitor Photos

Share real experiences through ratings, written reviews, and visitor photos.

* 1–5 star ratings
* Written reviews
* Up to 3 photos per review
* Client-side image resizing and compression before upload
* One review per user per temple
* Personal review deletion
* Aggregate ratings on temple listings and detail pages

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

## Screenshots

### Home
![Home](screenshots/home.png)

### Itinerary
![Itinerary](screenshots/itinerary.png)

### Planner
![Planner](screenshots/planner.png)

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

🔗 **Live:** https://temple-heritage-fawn.vercel.app/

---

## 🗺️ Roadmap

Future improvements can include:

* 🗺️ More advanced pilgrimage route optimization
* 🚗 Travel-distance and transport-aware planning
* 🔔 Festival and pilgrimage notifications
* 📍 Broader temple coverage across India
* 🌐 Expanded multilingual experiences
* 📊 More advanced recommendation models
* 👨‍💼 Expanded administrative and analytics tooling

---

## 👩‍💻 Author

**Aarya Shirsath**
Developer & Creator of Temple Heritage

---

## 🌸 Vision

Temple Heritage was built around a simple idea:

> **Technology can make India's sacred heritage easier to discover while helping people turn that discovery into meaningful journeys.**

Every temple has a story.
Every journey creates a memory.

**Temple Heritage brings both together.** 🪷

---

⭐ **Explore the live project:** https://temple-heritage-fawn.vercel.app/
