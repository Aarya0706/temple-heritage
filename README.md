# 🛕 Temple Heritage

**An AI-powered full-stack platform for discovering India's temple heritage and planning personalized pilgrimages.**

<p align="center">
  <a href="https://templeheritage.me/">Live Demo</a> •
  <a href="https://github.com/Aarya0706/temple-heritage">GitHub</a>
</p>

---

## 📸 Preview

| Home                                   | Itinerary                                        | AI Planner                                   |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| ![Home](./public/screenshots/home.png) | ![Itinerary](./public/screenshots/itinerary.png) | ![Planner](./public/screenshots/planner.png) |

---

## ✨ Overview

Temple Heritage is a full-stack web platform built to make India's rich temple heritage easier to **discover, understand, and experience**.

Instead of separating cultural information from travel planning, the platform combines:

* 🛕 Curated temple discovery
* 🤖 AI-assisted pilgrimage planning
* 🧠 Personalized temple recommendations
* 🗺️ Interactive maps and route visualization
* 📅 Festival discovery and temple associations
* 💬 AI-powered temple assistant with voice interaction
* ❤️ Saved temples and personalized yatras
* ⭐ Reviews, ratings, and visitor photos
* 🏅 Pilgrimage passport and completion badges
* 👨‍💼 Admin moderation and analytics

The result is a single platform that connects **heritage discovery + intelligent planning + user-generated experiences**.

---

## 🚀 Live Application

**Live:** https://templeheritage.me/

The application is deployed on **Vercel**.

---

## 🌟 Key Features

### 🛕 Temple Discovery

Explore a curated collection of Indian temples with structured information including:

* History
* Architecture
* Deity
* Festivals
* Darshan information
* Best time to visit
* Visitor and access notes
* Highlights and nearby destinations

Each temple has its own dedicated detail experience rather than being reduced to a simple card.

---

### 🤖 AI Yatra Planner

Generate a personalized pilgrimage itinerary using:

* Starting city
* Trip duration
* Preferred region
* Interests
* Travel style
* Festival focus
* Optional anchor temple

The planner generates a complete day-wise journey and combines AI output with the application's structured temple data.

### AI planning pipeline

```text
User Preferences
       │
       ▼
Planner Input
       │
       ▼
Temple Dataset Context
       │
       ▼
Groq AI
       │
       ▼
Structured JSON
       │
       ▼
Schema + Data Validation
       │
       ├── Invalid temple slug
       ├── Duplicate temple
       ├── Missing day
       └── Malformed response
       │
       ▼
Retry / Fallback Handling
       │
       ▼
Normalized Itinerary
       │
       ▼
Route Visualization
       │
       ▼
Save / Export
```

The planner is designed to prevent common LLM failure cases such as invented destinations, repeated temples, incomplete day arrays, and malformed responses.

---

### 🧠 Temple AI Assistant

Ask questions about:

* Temple history
* Deities
* Festivals
* Travel planning
* Pilgrimage destinations
* Temple-specific information

The assistant supports conversational interaction and voice-based input/output.

Responses are grounded against the application's structured temple and festival data instead of relying entirely on unrestricted model generation.

---

### 🧭 Personalized Recommendations

Recommend temples using user interests and travel preferences such as:

* Heritage
* Architecture
* Spiritual traditions
* Deity preferences
* Region
* Travel style

The recommendation system combines structured temple metadata with deterministic application logic.

---

### 🗺️ Interactive Temple Map

Explore temples geographically through an interactive map.

Features include:

* Clustered temple markers
* State-based exploration
* Deity filtering
* Festival filtering
* Route visualization
* Google Maps handoff for navigation

---

### 📅 Festival Discovery

Browse festivals connected to temples and discover:

* Festival dates
* Associated temples
* Cultural context
* Festival-specific temple experiences

Festival information is also used by the AI planner when building festival-focused yatras.

---

### ♈ Horoscope-Based Discovery

Discover temples using zodiac and planetary associations.

Users can explore temple recommendations based on their sun sign and related traditional associations.

---

### ❤️ Saved Temples & My Yatras

Authenticated users can:

* Save temples
* Save generated itineraries
* Revisit previous yatras
* Track pilgrimage progress
* View completed journeys

---

### 🏅 Pilgrimage Passport

The pilgrimage passport turns temple visits into a persistent travel record.

Users can:

* Track visited temples
* Record completed journeys
* Earn regional badges
* View pilgrimage statistics
* Export their passport
* Share a public passport experience

---

### ⭐ Reviews & Visitor Photos

Users can submit:

* Star ratings
* Written reviews
* Visitor photos

The system includes moderation states and restrictions around review/photo creation.

Photo uploads are compressed client-side before storage, while limits are also enforced at the database layer.

---

### 👨‍💼 Admin Dashboard

An admin experience is included for platform management.

Capabilities include:

* Review moderation
* Review status management
* Platform statistics
* Usage analytics
* Administrative access control

Admin access is protected through **Supabase Row Level Security and database-level authorization controls**.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      Next.js App     │
                         │ React + App Router   │
                         └──────────┬───────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
            UI / Components     API Routes      Server Logic
                   │                │                │
                   │                ▼                │
                   │             Groq AI             │
                   │                │                │
                   │                ▼                │
                   │       Validation / Retry        │
                   │                │                │
                   └────────────────┼────────────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │     Supabase     │
                           │ Auth / Postgres  │
                           │     Storage      │
                           └──────────────────┘
```

---

## 🧰 Tech Stack

| Technology                  | Purpose                                           |
| --------------------------- | ------------------------------------------------- |
| **Next.js**                 | Full-stack framework and application routing      |
| **React**                   | Interactive user interface                        |
| **TypeScript**              | Type-safe application development                 |
| **Supabase**                | Authentication, PostgreSQL database and storage   |
| **Groq SDK**                | AI itinerary planning and assistant capabilities  |
| **Leaflet / React Leaflet** | Interactive maps and route visualization          |
| **jsPDF**                   | Client-side itinerary and passport PDF generation |
| **Recharts**                | Admin analytics and data visualization            |
| **Lucide React**            | UI icons                                          |
| **Vitest**                  | Automated unit testing                            |
| **GitHub Actions**          | CI and database migration workflow                |
| **Vercel**                  | Production deployment                             |

---

## 🔐 Engineering Highlights

Temple Heritage was designed as more than a collection of UI screens.

### AI Reliability

AI responses are validated before they reach the application UI.

The planner checks for:

* Exact requested number of days
* Valid temple slugs
* Duplicate temple destinations
* Required response structure
* Safe normalization of generated content
* Retry handling for invalid generations

This reduces the risk of directly trusting model output.

### Data Integrity

The application validates AI-selected temple destinations against the application's real temple dataset rather than allowing arbitrary model-generated destinations.

### Authentication & Authorization

Supabase Authentication is combined with PostgreSQL Row Level Security for user-specific features and admin functionality.

### Review Moderation

Reviews support moderation states and controlled visibility.

Review photo uploads are limited both in the application layer and at the database level.

### API Protection

AI-heavy endpoints use application-level rate limiting to reduce unnecessary or abusive requests.

### Image Handling

User-uploaded review images are compressed client-side before being stored.

### Route Logic

Generated itineraries can be converted into geographically organized route visualizations, with travel information surfaced separately from the underlying AI-generated descriptions.

### Automated Testing

The repository contains tests covering multiple application utilities and domain-specific logic, including:

* AI helpers
* Recommendations
* Route optimization
* Route timing
* Temple search
* Festival logic
* Statistics
* Speech utilities
* Zodiac logic

---

## 🗃️ Database & Supabase

Supabase is used for:

```text
Authentication
     │
     ├── Profiles
     ├── Saved Temples
     ├── Yatra Plans
     ├── Reviews
     ├── Review Photos
     └── Pilgrimage / Completion Data
```

The repository includes versioned SQL migrations for database changes.

Important database protections include:

* Row Level Security
* Admin authorization controls
* Review ownership policies
* Photo ownership policies
* Review/photo limits
* Referential cleanup through foreign keys
* Aggregated review ratings

---

## 📂 Project Structure

```text
temple-heritage/
│
├── app/                    # Next.js routes, pages and API endpoints
│   ├── api/                # Server-side API routes
│   ├── admin/              # Admin dashboard
│   ├── planner/            # AI pilgrimage planner
│   ├── temples/            # Temple discovery and detail pages
│   ├── festivals/          # Festival discovery
│   ├── assistant/          # AI assistant
│   ├── recommender/        # Temple recommendations
│   ├── passport/           # Shared pilgrimage passport
│   └── my-yatras/          # Saved pilgrimage plans
│
├── components/             # Reusable React components
├── data/                   # Temple and festival data
├── lib/                    # Shared business logic and utilities
├── public/                 # Images, screenshots and static assets
├── scripts/                # Development / utility scripts
├── supabase/               # SQL migrations and database setup
├── .github/workflows/      # CI/CD workflows
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## ⚙️ Getting Started

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

Create a `.env.local` file using `.env.example`.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

Never commit secrets or API keys to the repository.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Development Commands

```bash
npm run dev
```

Start the development server.

```bash
npm run build
```

Create a production build.

```bash
npm run start
```

Run the production build locally.

```bash
npm run lint
```

Run ESLint checks.

```bash
npm test
```

Run the automated test suite.

```bash
npm run test:watch
```

Run Vitest in watch mode.

---

## 🔄 CI / CD

GitHub Actions runs on pushes and pull requests targeting `main`.

The workflow performs:

```text
Push / Pull Request
        │
        ▼
Install Dependencies
        │
        ▼
ESLint
        │
        ▼
Automated Tests
        │
        ▼
Production Database Migrations
```

Database migrations are only pushed after the validation job succeeds on the main branch.

---

## 🧠 What Makes the Project Different

Temple Heritage brings together several areas of modern application development in one system:

**AI**
→ structured generation, grounding, validation, retries and rate limiting

**Full Stack**
→ Next.js frontend + server-side APIs + Supabase backend

**Database Engineering**
→ PostgreSQL, migrations, RLS and authorization policies

**Product Design**
→ discovery, planning, personalization, social proof and progression loops

**Software Quality**
→ reusable components, typed logic, automated tests and CI

The project is intentionally built as an end-to-end product rather than as a standalone AI demo.

---

## 📊 Current Scope

Temple Heritage currently contains a curated collection of temples and festival information designed around the application's core discovery and pilgrimage-planning experience.

The architecture is designed so the content dataset can be expanded independently from the core application logic.

---

## 🗺️ Roadmap

Future improvements include:

* 🧭 More advanced pilgrimage route optimization
* 🚗 Transport-aware travel planning
* 📍 Larger temple coverage across India
* 🔔 Festival and pilgrimage notifications
* 🌐 Expanded multilingual support
* 🧠 More advanced recommendation models
* 📊 Deeper analytics and engagement insights
* 🚌 More detailed travel and accessibility information

---

## 🌸 Why I Built This

India's temples represent centuries of history, architecture, traditions, and living cultural practices.

But discovering that heritage and planning an actual pilgrimage often means switching between multiple sources.

Temple Heritage was built to bring those experiences together:

> **Discover the temple. Understand its story. Plan the journey. Remember the experience.**

---

## 👩‍💻 Author

**Aarya Shirsath**

Computer Science & Engineering Student
Developer & Creator of Temple Heritage

### Links

* 🌐 Live Project: https://templeheritage.me/
* 💻 GitHub: https://github.com/Aarya0706/temple-heritage

---

## ⭐ Support the Project

If you found Temple Heritage interesting, consider giving the repository a ⭐ on GitHub.

Built with curiosity, code, and a love for India's cultural heritage. 🛕
