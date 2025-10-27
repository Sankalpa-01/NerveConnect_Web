# 🧠 NerveConnect

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

NerveConnect is an intelligent, full-stack hospital management platform. It combines a **Voice Assistant (MediAssist)** for seamless appointment booking and a **Doctor Dashboard** powered by the Gemini AI for smart prescription generation with a built-in learning capability.

---

## 🚀 Features

### 🤖 AI Voice Frontdesk (MediAssist)
* **Speech-to-Text & Text-to-Speech** using browser-native Web Speech APIs.
* **Natural Language Understanding** with Gemini for intent parsing (extracting name, doctor, date, etc.).
* **Real-time Availability Check** against the doctor's schedule.
* **Voice-based Confirmation** of appointments.
* **Futuristic UI** featuring an interactive voice orb and fluid animations.

### 🧑‍⚕️ Doctor Dashboard
* **Patient Queue** displaying all patients assigned to the logged-in doctor.
* **AI-Powered Suggestions** using the Gemini API to generate prescriptions based on symptoms and vitals.
* **Doctor-in-the-Loop** (DITL) interface allowing doctors to review, edit, and approve AI suggestions.
* **Adaptive Learning** through a "backpropagation" mechanism, where doctor's edits are logged to fine-tune future AI suggestions.

### 🔐 Secure Authentication
* **Full Auth Flow** including sign-up, sign-in, and sign-out.
* **JWT-based Session Handling** stored securely in http-only cookies.
* **Password Protection** using `bcrypt` for hashing.
* **Protected Routes** via Next.js middleware to secure patient and dashboard data.

### 📊 Admin & Data Management
* **Robust Appointment Engine** handling complex Doctor-Patient-Date-Time logic.
* **Modern ORM** with Prisma for type-safe database access.
* **PostgreSQL Database** for centralized, relational data storage.
* **Centralized Records** for patients, appointments, disease records, and AI analysis logs.

---

## 🧱 Tech Stack

| Layer | Tech |
| :--- | :--- |
| 🎨 **Frontend** | Next.js (App Router), TypeScript, TailwindCSS, Lucide Icons, Web Speech API |
| ⚙️ **Backend** | Next.js API Routes, Prisma ORM, Gemini Pro API (LLM) |
| 🗃️ **Database** | PostgreSQL |
| 🔑 **Authentication** | JSON Web Tokens (JWT), Bcrypt |
| 🚀 **Deployment** | Vercel (Frontend), Railway / Render (Database) |

## 📂 Folder Structure (Simplified)
NerveConnect/ ├── prisma/ # Prisma schema & migrations ├── public/ # Static assets (images, icons) ├── src/ │ ├── app/ │ │ ├── (auth)/ # Auth pages (Sign in/out/up) │ │ ├── (platform)/ # Protected app routes │ │ │ ├── dashboard/ # Doctor dashboard UI │ │ │ └── frontdesk/ # Voice bot UI │ │ ├── api/ # Next.js API routes (backend logic) │ │ └── ... │ ├── components/ # Reusable React components │ ├── lib/ # Utility functions (Prisma client, auth) │ ├── types/ # TypeScript type definitions │ └── ... ├── .env.example # Environment variable template ├── next.config.ts # Next.js config └── README.md # This file

---

## ⚙️ Setup & Development

Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/Rishabh-Anand123/NerveConnect.git](https://github.com/Rishabh-Anand123/NerveConnect.git)
cd NerveConnect
```
### 2. Install Dependencies
npm install
or
yarn install
or
pnpm install

### 3. Set Environment Variables
Create a .env file in the root of the project and add the following variables.
Get this from your PostgreSQL provider (e.g., Railway, Render)
DATABASE_URL=postgresql://user:password@localhost:5432/nerveconnect

A strong, random string for signing JWTs
JWT_SECRET=your_super_secret_key_here

Your Google AI Studio API Key for Gemini
GEMINI_API_KEY=your_gemini_api_key

### 4. Push Database Schema
npx prisma db push

### 5. Run Development Server
npm run dev

---
