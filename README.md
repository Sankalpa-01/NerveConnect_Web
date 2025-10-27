🧠 NerveConnect
NerveConnect is an intelligent hospital management platform combining Voice Assistant for appointment booking and a Doctor Dashboard powered by Gemini AI for smart prescription generation with learning capability. It includes secure user authentication, real-time AI feedback, and full-stack integration with PostgreSQL via Prisma.

🚀 Features
🤖 AI Voice Frontdesk (MediAssist)
Speech recognition and synthesis using Web APIs

Gemini-integrated intent parsing

Collects patient name, doctor, date, and time

Checks doctor availability and confirms appointments

Responsive futuristic UI with interactive voice orb and animations

🧑‍⚕️ Doctor Dashboard
Displays assigned patients

Gemini API suggests prescriptions based on symptoms and vitals

Doctor can edit AI suggestions

System learns from doctor edits (backpropagation mechanism)

🔐 Authentication
Sign-up and sign-in with JWT-based session handling

Secure password storage with hashing

Auth-protected routes using middleware

📊 Admin + Data
Appointment booking engine (Doctor-Patient-Date logic)

Prisma ORM with PostgreSQL

Centralized patient/appointment records

Disease records and AI analysis logs

🧱 Tech Stack
Layer	Tech
Frontend	Next.js (App Router), TypeScript, TailwindCSS, Lucide, Web Speech API
Backend	Next.js API Routes, Prisma ORM, Gemini Pro API (LLM)
Database	PostgreSQL
Authentication	JWT, Bcrypt
Deployment	Vercel (Frontend), Railway/Render (DB)

📂 Folder Structure (Simplified)
NerveConnect/
├── prisma/                  # Prisma schema & migrations
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── frontdesk/       # Voice bot UI
│   │   ├── dashboard/       # Doctor dashboard
│   │   ├── api/             # Next.js API routes (backend logic)
│   │   ├── auth/            # Sign in/out/up pages
│   │   ├── utils/           # Helpers, styles
│   │   ├── types/           # Type declarations
│   └── lib/                 # Prisma client, auth utilities
├── .env                     # Environment variables
├── next.config.ts           # Next.js config
├── README.md                # This file
⚙️ Setup & Development
1. Clone the repo
git clone https://github.com/Rishabh-Anand123/NerveConnect.git
cd NerveConnect
2. Install dependencies
npm install
3. Set environment variables
Create a .env file:

env
DATABASE_URL=postgresql://user:password@localhost:5432/nerveconnect
JWT_SECRET=your_super_secret
GEMINI_API_KEY=your_gemini_api_key
4. Push database schema
npx prisma db push
5. Run development server
npm run dev
🧪 Testing the App
Visit http://localhost:3000/signup to create an account

http://localhost:3000/frontdesk for voice-based appointment booking

http://localhost:3000/dashboard for the doctor’s AI-powered prescription tool

📡 Deployment
Frontend: Deploy on Vercel:
vercel --prod
Database: Use Railway or Render for free PostgreSQL hosting.

Update the DATABASE_URL in .env accordingly.

🧠 Gemini Integration (Google AI)
Gemini is used for both:

Extracting structured data from voice transcript (appointment intent)

Generating prescription suggestions in the dashboard

🛡️ Auth Flow
JWT issued on login, stored in cookies

Middleware checks token validity

Protects patient/appointment API routes

📌 Todo / Improvements
✅ Add doctor availability calendar
⏳ Notifications (email/text)

📃 License
MIT License © 2025 Rishabh Anand

