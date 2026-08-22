# 🛡️ FinTell — AI Financial Guardian & Smart Money Companion

> **FinTell** is a next-generation, AI-powered financial literacy, scam protection, personal budgeting, and MSME business intelligence platform. It helps everyday citizens, young professionals, and shopkeepers make safe financial decisions, protect themselves against digital fraud, and build long-term wealth.

---

## 🌟 What is FinTell?

FinTell acts as a **24/7 Personal Financial Guardian**. Many people lose money due to financial illiteracy, hidden bank charges, unexpected debt, or sophisticated online UPI/SMS scams. FinTell solves this by bringing **AI-driven scam detection, smart debt calculators, bank statement analytics, and business reconciliation** into one intuitive application.

---

## 🎯 Key Objectives & How People Use FinTell

1. **Protect Against Digital Scams**: Paste suspicious links or UPI IDs to detect fraud before clicking or transferring money.
2. **Master Personal Finance**: Auto-categorize expenses, track subscriptions, plan savings goals, and accelerate loan payoffs.
3. **Run a Safe Business**: MSMEs and shopkeepers can reconcile bank feeds with purchase invoices and detect GST mismatches.
4. **Learn Financial Concepts**: Complete micro-lessons with quizzes, earn verified safety certificates, and translate complex financial jargon into simple terms.

---

## 🧩 Complete Feature & Module Breakdown

### 1. 📊 Personal Finance & Smart Analytics (`/dashboard/money`)
- **My Budget Plan**: Smart 50/30/20 budgeting rule customized to your income, calculating fixed needs, variable wants, recommended savings, and emergency buffer.
- **Bank Statement & Subscription Analyzer**: Drag & drop bank CSV passbook statement -> Auto-categorizes outlays (Food, Bills, Shopping, Transport) and flags hidden recurring OTT / Gym auto-debits.
- **Debt Payoff Calculator**: Input multiple loans/EMIs and compare two proven payoff strategies side-by-side:
  - **Debt Snowball**: Pay smallest balance first to build quick psychological momentum.
  - **Debt Avalanche**: Pay highest-interest loan first to maximize interest savings.
- **Custom Savings Goal Tracker**: Set specific targets (*New Electric Scooter*, *Emergency Cushion*, *Education*) with visual progress bars, monthly target deposits, and completion ETAs.

---

### 2. 🛡️ Scam Protection & AI Security Suite (`/dashboard/scams`)
- **Interactive Scam Drills**: Practice identifying fake KYC SMS, OTP traps, phishing emails, and UPI payment scams in a risk-free simulator.
- **Suspicious Link & UPI AI Checker**: Paste any suspicious SMS text, Telegram job link, or UPI ID (`cashback-win@upi`) -> AI calculates a **Fraud Risk Score (0-100)**, flags Red Flags, and gives immediate action advice.
- **Emergency Voice Call Scam Simulator**: Simulated incoming panic call screen (*"Hospital Emergency"*, *"CBI Digital Arrest"*), audio ringing sound effects, live transcript, and decision choices with instant feedback.
- **Downloadable Safety Certificate**: Complete drills to earn an official **"Certified Scam-Protected Citizen"** certificate featuring user name, safety score, issue date, seal, and QR verification badge with a direct **Print / Download PDF** trigger.

---

### 3. 💼 Business & Shopkeeper Suite (`/dashboard`)
*(Unlocked when selecting "Yes, I run a Business" during Onboarding)*
- **GST & Bank Feed Reconciliation (`/dashboard/reconcile`)**: Compare bank feed records with vendor invoices to spot GST rate discrepancies, duplicate payments, and missing invoices.
- **Document & Invoice Intelligence (`/dashboard/verify`)**: Verify vendor receipts, tax invoices, and tax filing documents.
- **Business Financial & Tax Reports (`/dashboard/reports`)**: Tax outlays, profit/loss summaries, and audit trail logs.

---

### 4. 📚 Financial Literacy & Interactive Tools
- **Bite-Sized Micro Lessons (`/dashboard/learn`)**: Short, practical modules on Banking, Investments, Budgeting, and Fraud Defense with quiz checkpoints and XP awards.
- **Financial Term Translator (`/dashboard/glossary`)**: Translates complex jargon (*SIP, CIBIL Score, CAGR, Inflation, GSTIN, Input Tax Credit*) into simple everyday language.
- **Interactive Calculators (`/dashboard/simulator`)**: Compound interest growth calculators, SIP vs Fixed Deposit comparisons, and emergency buffer planners.
- **My Progress & Badges (`/dashboard/progress`)**: Track total XP, rank levels, drill streaks, and safety badges earned.
- **AI Financial Guardian Assistant (`/dashboard/assistant`)**: Voice-enabled 24/7 AI chatbot to answer money questions safely without ever asking for passwords or PINs.

---

### 5. 🔒 User Privacy & Account Security
- **Multi-Language Support**: Easily switch between English, Hindi, and regional languages.
- **Account Control & Deletion**: Self-serve permanent account deletion with cascading database cleanup for complete data privacy.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15+ (App Router), React, TypeScript, Tailwind CSS
- **Icons & UI Components**: Lucide React Icons, Custom Accessible UI Library
- **Backend & Database**: Next.js Server Actions & API Routes, PostgreSQL, Drizzle ORM
- **AI & Processing**: Google Generative AI / Custom AI Heuristic Fraud Engine

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.x or higher)
- PostgreSQL database

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/fintell-2.git
   cd fintell-2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/fintell
   JWT_SECRET=your_secret_key_here
   ```

4. **Run Database Migrations & Seed**:
   ```bash
   npx drizzle-kit push
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📝 Verification & Build Commands

- **Type Check**:
  ```bash
  npm run typecheck
  ```
- **Production Build**:
  ```bash
  npm run build
  ```

---

## 📄 License

**Proprietary License (All Rights Reserved)**. Unauthorized copying, reproduction, modification, distribution, or commercial use of this codebase or software is strictly prohibited without explicit written permission. See [`LICENSE`](file:///d:/Projects/fintell-2/LICENSE) for more information.
