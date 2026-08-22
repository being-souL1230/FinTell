# FinTell: AI Financial Guardian and Smart Money Companion

FinTell is a comprehensive, AI-powered financial literacy, scam protection, personal budgeting, and MSME business intelligence platform. It is engineered to help citizens, young professionals, and shopkeepers make safe financial decisions, defend against digital financial fraud, optimize debt repayment, and build long-term financial security.

## Table of Contents

1. Overview
2. Complete 18-Module Breakdown
   - Category A: Scam Defense and AI Security Suite (Modules 1-4)
   - Category B: Personal Money Management and Debt Optimization (Modules 5-8)
   - Category C: Business and MSME Shopkeeper Suite (Modules 9-11)
   - Category D: Financial Literacy, AI, and Gamification (Modules 12-16)
   - Category E: Admin Management Suite (Module 17)
   - Category F: Multi-Language and Onboarding System (Module 18)
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

## 2. Complete 18-Module Breakdown

FinTell is structured into 18 dedicated feature modules split across 6 operational categories:

### Category A: Scam Defense and AI Security Suite

Path: `/dashboard/scams`

1. **Interactive Scam Scenario Drills** (`/dashboard/scams` -> `Scenario Drills`)
   - Interactive checkpoint drills covering SMS phishing, QR code payment traps, fake lottery calls, and investment fraud.
   - Immediate feedback breakdowns explaining the psychology behind each scam.
   - XP reward allocation upon successful resolution.

2. **AI Link and UPI Fraud Risk Checker** (`/dashboard/scams` -> `Link & UPI AI Checker`)
   - Instant text analyzer for suspicious URLs, Telegram job invitations, and UPI handles.
   - AI-generated Fraud Risk Score from 0 to 100 with clear threat level classification.
   - Real-time red flag extraction (unverified sender, urgency triggers, domain anomalies).
   - Step-by-step protective action advice.

3. **Emergency Voice Call Scam Simulator** (`/dashboard/scams` -> `Emergency Call Simulator`)
   - Real-time simulated phone call interface with Web Audio ringing effects.
   - Real-time ticking call duration timer (`MM:SS`).
   - Typewriter transcript playback simulating live caller audio.
   - CSS frequency audio waveform animation.
   - Progressive red flag detection card revealing scam indicators as the transcript streams.
   - Decline button handling to teach proper instinct for unknown calls.
   - Six Indian scam scenarios: Hospital Emergency, CBI Digital Arrest, Bank Account Freeze/KYC, Insurance Refund Fraud, Electricity Power Cut Threat, and FedEx Customs Contraband.

4. **Verified Safety Certificate** (`/dashboard/scams` -> `Safety Certificate`)
   - Official "Certified Scam-Protected Citizen" certificate generator.
   - Displays user name, safety score, issue timestamp, official seal, and unique QR verification badge.
   - Built-in print and download PDF functionality.

### Category B: Personal Money Management and Debt Optimization

Path: `/dashboard/money`

5. **Smart 50/30/20 Budget Planner** (`/dashboard/money` -> `My Budget Plan`)
   - Customized budget distribution tailored to user net income.
   - Divides income into Fixed Needs (50%), Variable Wants (30%), Recommended Savings (20%), and Emergency Buffer.
   - Visual progress indicators and surplus/deficit alerts.

6. **Bank Statement and Subscription Analyzer** (`/dashboard/money` -> `Statement Analyzer`)
   - Drag-and-drop parser for bank passbook CSV exports.
   - Auto-categorization of expenses (Food, Bills, Shopping, Transport, Healthcare).
   - Detection and flagging of hidden or forgotten recurring auto-debit subscriptions.

7. **Debt Payoff Calculator (Snowball vs. Avalanche)** (`/dashboard/money` -> `Debt Payoff Calculator`)
   - Multi-loan management input for credit cards, personal loans, and EMIs.
   - Side-by-side strategy comparison:
     - Debt Snowball: Pay smallest balance first for quick psychological wins.
     - Debt Avalanche: Pay highest interest rate first for maximum monetary savings.
   - Detailed month-by-month payoff timeline, interest paid, and completion dates.

8. **Custom Goal Tracker** (`/dashboard/money` -> `Custom Goal Tracker`)
   - Visual goal creation for Emergency Funds, Vehicle, Education, Home, or Business.
   - Target amount setting with progress bar tracking and monthly contribution targets.
   - Estimated completion date calculation based on saving pace.

### Category C: Business and MSME Shopkeeper Suite

Path: Unlocked when Business Mode is selected in onboarding

9. **GST and Bank Feed Reconciliation** (`/dashboard/reconcile`)
   - Comparison engine matching bank transaction feeds against vendor purchase invoices.
   - Auto-detection of GST rate discrepancies, duplicate payments, and unrecorded receipts.
   - Discrepancy flagging for small business compliance.

10. **Document and Invoice Verification** (`/dashboard/verify`)
    - Document verification for uploaded vendor receipts, tax invoices, and GSTIN numbers.
    - Authenticity checking to prevent double-billing and fraudulent invoices.

11. **Business Tax and Financial Reports** (`/dashboard/reports`)
    - Comprehensive profit and loss (P&L) summaries.
    - GST outlay calculations and estimated tax liabilities.
    - Exportable audit trail logs for shopkeepers and small business owners.

### Category D: Financial Literacy, AI, and Gamification

12. **Bite-Sized Micro Lessons** (`/dashboard/learn`)
    - Structured educational curriculum on Banking Basics, UPI Safety, Fixed Deposits, Mutual Funds, CIBIL Scores, and Tax Filing.
    - Interactive quiz checkpoints at the end of each lesson.
    - Category filtering and lesson progress tracking.

13. **Financial Term Translator** (`/dashboard/glossary`)
    - Searchable dictionary translating complex financial jargon (SIP, CAGR, Input Tax Credit, Inflation, Repo Rate, CIBIL).
    - Clear, everyday language explanations with practical usage examples.

14. **Financial Simulators and Calculators** (`/dashboard/simulator`)
    - Fixed Deposit (FD) return growth simulator.
    - Compound interest multiplier calculator.
    - Loan EMI calculator and savings comparison model.

15. **My Progress and Achievement Tracking** (`/dashboard/progress`)
    - User profile overview tracking earned XP points, rank levels, and drill streaks.
    - Achievement badge showcase with unlock criteria.
    - Completed safety certifications log.

16. **AI Financial Guardian Assistant** (`/dashboard/assistant`)
    - 24/7 conversational financial assistant powered by Groq LLM.
    - Localized Knowledge Base fallback for instant answers.
    - Voice-enabled input support and markdown response formatting.
    - Strict security guardrails (refuses credential requests).

### Category E: Admin Management Suite

Path: `/dashboard/admin`

17. **Admin Management Suite** (`/dashboard/admin`)
    - Overview Dashboard (`/dashboard/admin`): Metrics on total users, completed drills, active lessons, and system health.
    - Lesson Manager (`/dashboard/admin/lessons`): CRUD interface to create, edit, reorder, and delete micro-lessons and quiz questions.
    - Scam Drill Manager (`/dashboard/admin/scams`): Tools to add, edit, or disable scam scenarios and risk parameters.
    - Glossary Manager (`/dashboard/admin/glossary`): Interface to manage financial terms and plain-language definitions.
    - User Analytics and Role Management (`/dashboard/admin/users`): User directory, role promotion (User <-> Admin), and XP adjustments.

### Category F: Multi-Language and Onboarding System

18. **Multi-Language and Onboarding System** (`/onboarding`)
    - Multi-language support across 11 Indian languages (English, Hindi, Marathi, Tamil, Bengali, Telugu, Gujarati, Punjabi, Kannada, Malayalam, Odia).
    - Onboarding flow with mode selection (Everyday Citizen vs. MSME Business Owner).
    - One-click Guest Mode access.
    - Self-serve permanent account deletion with cascading database cleanup.

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
