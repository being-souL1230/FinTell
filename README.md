# FinTell: AI Financial Guardian and Smart Money Companion

FinTell is a comprehensive, AI-powered financial literacy, scam protection, personal budgeting, and MSME business intelligence platform. It is engineered to help citizens, young professionals, and shopkeepers make safe financial decisions, defend against digital financial fraud, optimize debt repayment, and build long-term financial security.

## Table of Contents

1. Overview
2. Core Features and Module Breakdown
   - Scam Protection and AI Security Suite
   - Personal Money Management
   - Business and MSME Mode
   - Financial Literacy and Gamification
   - AI Financial Assistant
3. Architecture and Technology Stack
4. Database Schema and Infrastructure
5. Installation and Local Setup
6. Environment Configuration
7. Database Commands and Migrations
8. Project Folder Structure
9. Security and Privacy Principles
10. License

## 1. Overview

Financial illiteracy and sophisticated digital fraud cause severe financial loss across urban and rural populations. From deceptive UPI cashback links to high-pressure fake police calls and unmanaged high-interest debt, individuals often lack real-time tools to evaluate risk.

FinTell addresses this challenge by providing an all-in-one financial operating system that combines real-time AI scam detection, interactive voice call simulators, debt optimization engines, bank statement analytics, and automated GST reconciliation for small businesses.

## 2. Core Features and Module Breakdown

### Scam Protection and AI Security Suite

Path: `/dashboard/scams`

FinTell provides a complete cyber defense training and verification environment to build resilience against digital financial crimes.

- Link and UPI AI Fraud Checker (`/dashboard/scams` -> `Link & UPI AI Checker`): Allows users to input suspicious text messages, URL links, Telegram job offers, or UPI handles. The AI engine evaluates suspicious patterns, calculates a Fraud Risk Score (0 to 100), identifies specific red flags, and gives instant guidance.
- Emergency Voice Call Scam Simulator (`/dashboard/scams` -> `Emergency Call Simulator`): An interactive, real-time simulated call environment equipped with Web Audio ringing effects, ticking call timers, live typewriter transcripts, audio waveform animations, and real-time red flag detectors. It trains users against six realistic Indian scam scenarios:
  1. Hospital Emergency Panic Call (Urgent UPI deposit trap)
  2. Fake CBI and Police Digital Arrest Call (WhatsApp video warrant extortion)
  3. Bank Account Freeze and Urgent KYC Expiry (OTP theft trap)
  4. Insurance Policy Cash Refund and Bonus Fraud (Upfront GST fee trap)
  5. Electricity Board Instant Power Cut Threat (Malicious APK installation threat)
  6. International Customs Courier Contraband Scam (FedEx narcotics extortion)
- Interactive Scam Scenario Drills: Practical checkpoint exercises covering SMS phishing, fake lottery calls, investment fraud, and QR code scams with detailed explanation breakdowns.
- Verified Safety Certificate (`/dashboard/scams` -> `Safety Certificate`): Once users complete security drills, FinTell generates an official "Certified Scam-Protected Citizen" certificate showing user name, safety score, issue timestamp, seal, QR verification code, and print/download functionality.

### Personal Money Management

Path: `/dashboard/money`

- Smart 50/30/20 Budget Planner: Customizes budget allocation based on monthly net income, separating fixed essential needs (50%), variable wants (30%), recommended savings (20%), and emergency buffer thresholds.
- Bank Statement and Subscription Analyzer: Accepts bank CSV passbook exports, auto-categorizes outlays (Food, Utilities, Shopping, Transport), and identifies hidden or unexpected recurring subscriptions.
- Debt Payoff Calculator (Snowball vs. Avalanche): Allows users to input multiple active loans or credit card balances and compare two mathematical payoff strategies side-by-side:
  - Debt Snowball: Prioritizes paying the lowest balance first for psychological momentum.
  - Debt Avalanche: Prioritizes paying the highest interest rate loan first to minimize total interest paid over time.
- Custom Goal Tracker: Visual progress tracking for long-term objectives (Emergency Fund, Vehicle, Education, Home) with monthly deposit targets and estimated completion timelines.

### Business and MSME Mode

Path: `/dashboard` (Unlocked when business mode is selected in onboarding)

- GST and Bank Feed Reconciliation (`/dashboard/reconcile`): Compares bank transaction feeds against vendor purchase invoices to detect tax rate discrepancies, duplicate billing, and unrecorded transactions.
- Document and Invoice Verification (`/dashboard/verify`): Analyzes uploaded receipts, tax invoices, and GSTIN numbers to ensure authenticity.
- Business Financial and Tax Reports (`/dashboard/reports`): Generates consolidated profit and loss summaries, estimated GST outlays, and audit trails for shopkeepers and MSMEs.

### Financial Literacy and Gamification

- Bite-Sized Micro Lessons (`/dashboard/learn`): Structured learning modules covering Banking Basics, UPI Safety, Fixed Deposits, Mutual Funds, CIBIL Scores, and Tax Filing. Each lesson includes quiz checkpoints and XP rewards.
- Financial Jargon Translator (`/dashboard/glossary`): A searchable glossary translating complex financial terms (SIP, CAGR, Input Tax Credit, Repo Rate, Inflation) into clear language.
- Financial Simulators (`/dashboard/simulator`): Interactive calculators for Fixed Deposit (FD) returns, Compound Interest growth, EMI schedules, and Savings comparison.
- Progress and Achievement Tracking (`/dashboard/progress`): Tracks user XP, rank badges, streak counts, and completed security certifications.

### AI Financial Assistant

Path: `/dashboard/assistant`

A 24/7 conversational financial assistant powered by Groq LLM and localized knowledge base search. It answers questions on budgeting, banking rules, investments, and fraud defense while maintaining strict safety guardrails (never asking for or storing passwords, OTPs, or PINs).

## 3. Architecture and Technology Stack

- Framework: Next.js 15+ (App Router, React 19)
- Language: TypeScript
- Styling: Tailwind CSS v4, custom utility styling
- Database: PostgreSQL (Neon Serverless PostgreSQL support)
- Object Relational Mapper (ORM): Drizzle ORM
- Database Driver: `pg` (node-postgres)
- Authentication and State: JSON Web Tokens (JWT via `jose`), HTTP-only cookies, React Context
- Icons: Lucide React Icons
- AI Integration: Groq API (`openai/gpt-oss-120b`, `groq/compound`) and local Knowledge Base search fallback

## 4. Database Schema and Infrastructure

The database schema is defined in `src/db/schema.ts` and managed via Drizzle ORM.

Key Database Tables:
- `users`: User profiles, credentials, role (user/admin), language preferences, onboarding state, business flag, and XP points.
- `lessons` & `lesson_progress`: Learning curriculum data and user completion records.
- `quiz_questions`: Checkpoint questions linked to lessons.
- `scam_scenarios` & `scam_attempts`: Security drills and user performance tracking.
- `badges` & `user_badges`: Gamification rewards and user achievement links.
- `glossary_terms`: Financial terms dictionary data.
- `money_profiles` & `monthly_money_progress`: User financial setups, income, expenses, and savings targets.
- `ai_chat_logs`: Audit trail for AI assistant queries.

## 5. Installation and Local Setup

### Prerequisites

- Node.js version 18.x or higher
- PostgreSQL database instance (local PostgreSQL server or Neon PostgreSQL connection URL)

### Step-by-Step Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/being-souL1230/FinTell.git
   cd FinTell
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Section 6).

4. Run database migrations and seed demo data:
   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## 6. Environment Configuration

Create a `.env` file in the project root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@ep-host.aws.neon.tech/neondb?sslmode=require"
GROQ_API_KEY="your_groq_api_key_here"
```

## 7. Database Commands and Migrations

- Generate new Drizzle migration from schema changes:
  ```bash
  npm run db:generate
  ```

- Run database migrations and seed default data:
  ```bash
  npm run db:seed
  ```

- Push schema directly to database (development mode):
  ```bash
  npx drizzle-kit push
  ```

## 8. Project Folder Structure

```
fintell/
├── drizzle/                   # Drizzle SQL migration files
│   ├── 0000_...sql
│   └── 0001_...sql
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── api/               # REST API endpoints (auth, scams, lessons, ai)
│   │   ├── dashboard/         # Dashboard pages (money, scams, learn, reconcile, etc.)
│   │   ├── login/
│   │   ├── register/
│   │   └── onboarding/
│   ├── components/            # UI components and feature modules
│   │   ├── dashboard/         # VoiceScamSimulator, FraudChecker, DebtPayoffCalculator, etc.
│   │   └── Header.tsx, Sidebar.tsx, UI libraries
│   ├── db/                    # Drizzle database connection and schema definitions
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   └── lib/                   # Utility functions, AI service, i18n, scoring engines
├── public/                    # Static images, assets, and icons
├── drizzle.config.json        # Drizzle ORM configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 9. Security and Privacy Principles

- Zero Credential Exposure: FinTell explicitly blocks and warns against sharing OTPs, UPI PINs, passwords, or full card numbers.
- Self-Serve Account Erasure: Users have complete control to permanently delete their account and associated data.
- Environment Secret Protection: API keys and database credentials are managed strictly via environment variables and excluded from source control.

## 10. License

Proprietary License (All Rights Reserved). Unauthorized copying, reproduction, distribution, or commercial use of this codebase or software is strictly prohibited without explicit written permission.
