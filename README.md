# 🛕 Temple Heritage

### Discover India's Sacred Heritage. Plan Your Spiritual Journey.

**Temple Heritage** is an AI-powered platform designed to help users explore India's rich spiritual and cultural heritage. From discovering historic temples and learning about festivals to planning personalized pilgrimages with AI, the platform brings multiple aspects of spiritual travel together in one modern application.

---

## ✨ Features

### 🛕 Explore Temples

Discover temples across India with detailed information about:

* 📍 Location
* 🙏 Presiding deity
* 🏛️ History and architecture
* ⏰ Darshan timings
* ✨ Cultural highlights
* 🗂️ Temple categories and types

Users can search and filter temples based on factors such as:

* State
* Deity
* Temple type
* Name

---

### 🔍 Darshan Explorer

Search through temple darshan information and explore temples based on:

* Temple name
* Deity
* City
* State
* Region

The platform displays available darshan timings and encourages visitors to confirm timings before travelling.

---

### 🎉 Festival Explorer

Explore important Indian festivals connected to India's spiritual traditions.

Features include:

* Festival cards with images
* Detailed festival pages
* Festival descriptions
* Month-based festival information
* Searchable festival data through an API

---

## 🤖 AI Yatra Planner

One of the core features of **Temple Heritage** is the AI-powered pilgrimage planner.

Users can provide their travel preferences, and the system generates a personalized pilgrimage itinerary.

The AI planner:

* 🧭 Suggests relevant temples
* 📅 Creates structured itineraries
* 🗓️ Organizes the journey day by day
* 🛕 Uses structured temple data as context
* 💾 Allows authenticated users to save their generated yatras

---

## 💬 Temple AI Assistant

The platform includes an AI-powered assistant that helps users interact with temple and festival information.

The assistant is grounded in the application's structured temple and festival data, helping provide more relevant responses related to India's sacred heritage.

Features include:

* 💬 Conversational interface
* 🛕 Temple-related assistance
* 🎉 Festival-related information
* 🧠 Chat history support
* ⚡ Real-time AI responses

---

## ❤️ Save Your Favorite Temples

Authenticated users can save temples they are interested in.

Saved temples are securely stored using **Supabase** and displayed inside the user's personal journey area.

---

## 🗺️ My Yatras

Users can save AI-generated pilgrimage plans and revisit them later.

Features include:

* 📂 View saved itineraries
* 📅 Day-by-day journey details
* 🔐 User-specific data access
* 🧾 Personalized yatra history

Each itinerary is securely scoped to the authenticated user.

---

## 📄 Download Itinerary as PDF

Users can download their personalized pilgrimage itinerary as a PDF.

The generated PDF includes:

* 🛕 Journey information
* 📅 Day-by-day itinerary
* 📝 AI-generated recommendations
* ✨ Structured and readable formatting

PDF generation happens directly on the client side.

---

## 👤 Authentication & Profile Management

Temple Heritage includes a complete authentication flow powered by Supabase.

Users can:

* ✍️ Sign up
* 🔐 Log in
* 🚪 Log out
* 👤 Manage their profile
* 🏙️ Add or update their home city
* ❤️ Save temples
* 🗺️ Save personalized yatras

---

# 🧠 How the AI Works

The AI features are connected to structured temple and festival data.

The general flow is:

```text
User Input
    ↓
AI API Route
    ↓
Structured Temple + Festival Data
    ↓
Groq LLM
    ↓
Structured AI Response
    ↓
Personalized Experience
```

This helps the AI planner and assistant provide responses that are connected to the application's available heritage data.

---

# 🏗️ Tech Stack

| Technology             | Purpose                          |
| ---------------------- | -------------------------------- |
| **Next.js**            | Full-stack React framework       |
| **React**              | User interface development       |
| **TypeScript**         | Type-safe development            |
| **Tailwind-style CSS** | UI styling                       |
| **Supabase**           | Authentication and database      |
| **PostgreSQL**         | Database infrastructure          |
| **Groq API**           | AI-powered planner and assistant |
| **Groq SDK**           | LLM integration                  |
| **jsPDF**              | Client-side PDF generation       |

---

# 📂 Project Structure

```text
temple-heritage
│
├── app
│   ├── about
│   ├── assistant
│   ├── darshan
│   ├── festivals
│   │   └── [slug]
│   ├── login
│   ├── logout
│   ├── my-yatras
│   │   └── [id]
│   ├── planner
│   ├── profile
│   ├── recommender
│   ├── temples
│   │   └── [slug]
│   │
│   └── api
│       ├── assistant
│       ├── festivals
│       ├── planner
│       └── yatra-plans
│
├── components
│   ├── Navbar
│   ├── TempleExplorer
│   ├── DarshanExplorer
│   ├── DownloadItineraryButton
│   ├── SaveTempleButton
│   └── ProfileForm
│
├── data
│   ├── temples.ts
│   └── festivals.ts
│
├── lib
│   ├── ai.ts
│   ├── slug.ts
│   ├── pdf-fonts.ts
│   ├── pdf-logo.ts
│   └── supabase
│
├── public
│   └── festivals
│
└── middleware.ts
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <your-repository-url>
```

## 2. Navigate to the Project

```bash
cd temple-heritage
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment Variables

Create a file named:

```text
.env.local
```

Add your required environment variables:

```env
GROQ_API_KEY=your_groq_api_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Run the Development Server

```bash
npm run dev
```

Open the local development server shown in your terminal.

---

# 🗄️ Database Features

The project currently uses Supabase for:

* User authentication
* User profiles
* Saved temples
* Saved yatra plans
* Row Level Security

The main database tables include:

```text
profiles
saved_temples
yatra_plans
```

User data is protected so that users can access only their own saved information.

---

# 🧭 Application Pages

| Page              | Description                                    |
| ----------------- | ---------------------------------------------- |
| 🏠 Home           | Introduction to Temple Heritage                |
| 🛕 Temples        | Browse and discover temples                    |
| 🔍 Darshan        | Search temple darshan information              |
| 🎉 Festivals      | Explore important spiritual festivals          |
| 🤖 AI Planner     | Generate personalized pilgrimage itineraries   |
| 💬 AI Assistant   | Ask questions related to temples and festivals |
| ❤️ My Yatras      | View saved pilgrimage plans                    |
| 👤 Profile        | Manage user information                        |
| 🔐 Login / Signup | User authentication                            |

---

# 🔮 Future Improvements

Some planned improvements include:

* 🗺️ Interactive India temple map
* 📍 Map integration
* 🛠️ Admin dashboard
* 📊 Temple and festival management
* 🚦 API rate limiting
* 🗄️ Migration of larger datasets to database tables
* 🌐 Production deployment
* 📱 Additional mobile optimizations

---

# 🎯 Project Vision

Temple Heritage aims to combine **technology, artificial intelligence, culture, and spirituality** into a single platform.

The goal is to make India's sacred heritage easier to explore while providing users with personalized tools for discovering temples, understanding traditions, and planning meaningful spiritual journeys.

---

# 👩‍💻 Author

**Aarya Shirsath**

Computer Science Engineering Student
Interested in Artificial Intelligence, Full-Stack Development, Cloud Technologies, and Intelligent Systems.

---

## ⭐ If you like this project

Consider giving the repository a **star** ⭐

Your support helps motivate further development of **Temple Heritage** 🛕✨
