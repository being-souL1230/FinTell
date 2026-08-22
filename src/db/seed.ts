import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";
import {
  badges,
  glossaryTerms,
  lessonProgress,
  lessons,
  moneyProfiles,
  monthlyMoneyProgress,
  quizQuestions,
  scamAttempts,
  scamScenarios,
  userBadges,
  users,
} from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Running database migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied successfully!");

  console.log("Seeding FinTell demo data...");

  // Clear existing content tables to purge old Hinglish data
  await db.delete(quizQuestions);
  await db.delete(lessonProgress);
  await db.delete(lessons);
  await db.delete(scamAttempts);
  await db.delete(scamScenarios);
  await db.delete(glossaryTerms);
  await db.delete(badges);

  // ---------- Lessons ----------
  const lessonSeeds = [
    {
      slug: "what-is-a-bank-account",
      title: "What is a Bank Account?",
      category: "Banking Basics",
      icon: "🏦",
      difficulty: "easy",
      summary: "Fundamental understanding of bank accounts, account numbers, and passbooks.",
      whyItMatters:
        "A bank account keeps your money safe and is essential for digital payments, savings, and direct benefit transfers.",
      explanation:
        "A bank account is a secure place to store your money. The two primary types are Savings Accounts (for daily transactions and saving with interest) and Current Accounts (for business operations). Each account has a unique account number, and your passbook records all transactions.",
      example:
        "Ramesh opened a Savings Account at his local bank branch. Now he can receive his salary directly and withdraw cash from an ATM when needed.",
      commonMistake:
        "Sharing your account number with unknown callers or suspicious messages. Only share your account number when expecting a payment from trusted sources.",
      safetyTip: "Keep your passbook and account details confidential.",
      orderIndex: 1,
    },
    {
      slug: "ifsc-kyc-basics",
      title: "Understanding IFSC and KYC",
      category: "Banking Basics",
      icon: "🧾",
      difficulty: "easy",
      summary: "Essential concepts for bank transfers and identity verification.",
      whyItMatters: "Bank transfers require an IFSC code, and full account features require verified KYC.",
      explanation:
        "IFSC (Indian Financial System Code) is an 11-character code identifying a bank branch for transfers like NEFT/RTGS/IMPS. KYC (Know Your Customer) is the process by which banks verify identity using official ID documents to prevent fraud.",
      example:
        "Sunita needed to transfer money to her brother's account in another city. She obtained his account number and IFSC code to complete the transaction.",
      commonMistake: "Clicking links in SMS messages to 'update KYC'.",
      safetyTip:
        "Genuine KYC is conducted only at bank branches, through official bank apps, or on verified websites.",
      orderIndex: 2,
    },
    {
      slug: "how-upi-works",
      title: "How UPI Works",
      category: "UPI",
      icon: "📱",
      difficulty: "easy",
      summary: "Sending and receiving money using UPI and the essential safety rule.",
      whyItMatters: "UPI is the most popular digital payment method — using it safely is crucial.",
      explanation:
        "UPI (Unified Payments Interface) lets you transfer money instantly bank-to-bank using a UPI ID or QR code. The golden rule: UPI PIN is required ONLY to SEND money, NEVER to receive money.",
      example:
        "Anita displayed a QR code at her shop. Customers scan the QR to pay — Anita receives a notification without ever entering a PIN.",
      commonMistake:
        "Entering a UPI PIN upon receiving a 'collect request' thinking it will credit money to their account.",
      safetyTip: "Immediately DECLINE any request asking for your UPI PIN to receive money.",
      orderIndex: 3,
    },
    {
      slug: "atm-debit-card-safety",
      title: "ATM and Debit Card Safety",
      category: "ATM & Debit Card",
      icon: "💳",
      difficulty: "easy",
      summary: "Best practices for protecting your ATM PIN, card details, and avoiding fraud.",
      whyItMatters: "Card fraud is common, but basic precautions protect your funds completely.",
      explanation:
        "A debit card allows cash withdrawals and store payments using a 4-6 digit PIN. Card skimming involves unauthorized devices attached to ATMs to steal card details.",
      example:
        "Vikram covers the keypad with one hand whenever entering his PIN at an ATM.",
      commonMistake: "Sharing your PIN with anyone or accepting 'help' from strangers at an ATM.",
      safetyTip: "Always shield the keypad with your hand while entering your PIN.",
      orderIndex: 4,
    },
    {
      slug: "savings-account-basics",
      title: "Savings Account & Interest",
      category: "Savings",
      icon: "💰",
      difficulty: "easy",
      summary: "How savings accounts generate interest and how minimum balance requirements work.",
      whyItMatters: "Understanding savings helps you make smarter financial decisions.",
      explanation:
        "Money in a savings account earns interest over time. Banks require maintaining a minimum average balance in certain accounts to avoid service fees.",
      example:
        "Geeta earns annual interest on her savings balance, growing her money safely without extra risk.",
      commonMistake: "Allowing your account balance to fall below the minimum required limit.",
      safetyTip: "Confirm the minimum balance rules of your account type with your bank.",
      orderIndex: 5,
    },
    {
      slug: "fd-rd-explained",
      title: "Understanding FD and RD",
      category: "Financial Products",
      icon: "📈",
      difficulty: "medium",
      summary: "Core concepts of Fixed Deposits and Recurring Deposits.",
      whyItMatters: "FDs and RDs offer higher returns than savings accounts for committed timeframes.",
      explanation:
        "A Fixed Deposit (FD) locks in a lump sum for a fixed period at guaranteed interest. A Recurring Deposit (RD) involves regular monthly deposits over a set tenure.",
      example: "Suresh opened an FD for 1 year at 6.5% interest, earning guaranteed returns upon maturity.",
      commonMistake: "Not realizing that premature withdrawal of an FD/RD may incur interest penalties.",
      safetyTip: "Review premature withdrawal penalties before starting an FD or RD.",
      orderIndex: 6,
    },
    {
      slug: "loans-and-emi",
      title: "Loans and EMI Fundamentals",
      category: "Loans",
      icon: "🏠",
      difficulty: "medium",
      summary: "Understanding EMIs, interest rates, and total loan repayment costs.",
      whyItMatters: "Borrowing without understanding total costs can cause long-term financial strain.",
      explanation:
        "Taking a loan requires repaying the principal plus interest in Equated Monthly Installments (EMIs). Early payments cover higher interest proportions.",
      example:
        "A ₹50,000 loan at 10% interest for 12 months requires monthly EMIs and results in a known total repayment figure.",
      commonMistake: "Focusing solely on the monthly EMI amount while ignoring total interest costs.",
      safetyTip: "Use the EMI Simulator to calculate total repayment before accepting any loan.",
      orderIndex: 7,
    },
    {
      slug: "insurance-basics",
      title: "Insurance Essentials",
      category: "Insurance",
      icon: "🛡️",
      difficulty: "medium",
      summary: "Understanding premiums, coverage, claims, and policy exclusions.",
      whyItMatters: "Insurance acts as a financial shield against unexpected risks and emergencies.",
      explanation:
        "Insurance involves paying regular premiums for financial coverage against specific events. Policies contain exclusions that detail what is not covered.",
      example:
        "Mohan pays a monthly health insurance premium so his medical bills are covered if hospitalized.",
      commonMistake: "Signing policy documents without reading the coverage exclusions.",
      safetyTip: "Insurance is risk protection, not an investment. Read full policy terms carefully.",
      orderIndex: 8,
    },
    {
      slug: "digital-banking-safety",
      title: "Digital Banking Safety",
      category: "Digital Safety",
      icon: "🔒",
      difficulty: "easy",
      summary: "How to stay protected from OTP scams, phishing links, and fraud calls.",
      whyItMatters: "Digital banking is convenient, but staying alert against scams is mandatory.",
      explanation:
        "OTPs, PINs, CVVs, and passwords are for your eyes only. No official bank employee or authority will ever request these credentials.",
      example:
        "Priya received a suspicious SMS asking her to update KYC via a link. She ignored the link and visited her bank branch to verify.",
      commonMistake: "Panic-acting on urgent warning messages received via SMS or messaging apps.",
      safetyTip: "Never share your OTP, PIN, CVV, or password with anyone.",
      orderIndex: 9,
    },
  ];

  const insertedLessons = await db.insert(lessons).values(lessonSeeds).onConflictDoNothing().returning();

  // if lessons already existed (script re-run), fetch full list
  const allLessons = insertedLessons.length > 0 ? insertedLessons : await db.select().from(lessons);
  const lessonBySlug = new Map(allLessons.map((l) => [l.slug, l]));

  // ---------- Quiz Questions ----------
  const quizSeeds: {
    slug: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: "a" | "b" | "c" | "d";
    explanation: string;
  }[] = [
    {
      slug: "what-is-a-bank-account",
      question: "What is the primary purpose of a savings account?",
      optionA: "Business transactions",
      optionB: "Daily transactions and saving money",
      optionC: "Taking loans only",
      optionD: "Buying stocks only",
      correctOption: "b",
      explanation: "Savings accounts are designed for daily transactions and earning interest on savings.",
    },
    {
      slug: "what-is-a-bank-account",
      question: "When is it appropriate to share your bank account number?",
      optionA: "When an unknown caller requests it",
      optionB: "When expecting a payment from a trusted employer or source",
      optionC: "Never",
      optionD: "In a public social media post",
      correctOption: "b",
      explanation: "Account numbers should only be shared in trusted contexts for receiving payments.",
    },
    {
      slug: "ifsc-kyc-basics",
      question: "What is the primary purpose of an IFSC code?",
      optionA: "To set an ATM PIN",
      optionB: "To uniquely identify a bank branch for transfers",
      optionC: "For insurance claims",
      optionD: "To reset your password",
      correctOption: "b",
      explanation: "IFSC uniquely identifies bank branches for electronic transfers.",
    },
    {
      slug: "ifsc-kyc-basics",
      question: "Where can you safely update your official KYC details?",
      optionA: "Through an SMS link",
      optionB: "Via a WhatsApp forward",
      optionC: "At an official bank branch, app, or verified website",
      optionD: "Over an unknown phone call",
      correctOption: "c",
      explanation: "KYC updates occur only through official banking channels.",
    },
    {
      slug: "how-upi-works",
      question: "When is a UPI PIN required?",
      optionA: "When receiving money",
      optionB: "When sending money",
      optionC: "When opening the app",
      optionD: "When checking your account balance",
      correctOption: "b",
      explanation: "A UPI PIN is required only to send money, never to receive it.",
    },
    {
      slug: "how-upi-works",
      question: "What should you do if someone sends a collect request asking for your PIN?",
      optionA: "Enter your PIN",
      optionB: "Decline the request immediately",
      optionC: "Forward the request",
      optionD: "Take a screenshot",
      correctOption: "b",
      explanation: "Entering a PIN on a collect request sends your money away — decline it.",
    },
    {
      slug: "atm-debit-card-safety",
      question: "What is the safest practice when entering your ATM PIN?",
      optionA: "Saying it out loud",
      optionB: "Covering the keypad with your hand",
      optionC: "Showing your PIN to someone",
      optionD: "Telling the security guard",
      correctOption: "b",
      explanation: "Shielding the keypad prevents shoulder-surfing and camera recording.",
    },
    {
      slug: "atm-debit-card-safety",
      question: "What do card skimming devices steal?",
      optionA: "Your photo",
      optionB: "Debit/credit card details",
      optionC: "Your Aadhaar number",
      optionD: "Nothing",
      correctOption: "b",
      explanation: "Skimmers capture magnetic stripe data from cards.",
    },
    {
      slug: "savings-account-basics",
      question: "What may happen if you fail to maintain the minimum required balance?",
      optionA: "You earn bonus interest",
      optionB: "Non-maintenance charges or penalties may apply",
      optionC: "The account closes automatically",
      optionD: "Nothing happens",
      correctOption: "b",
      explanation: "Banks may charge non-maintenance fees if minimum balance rules are broken.",
    },
    {
      slug: "fd-rd-explained",
      question: "How do you deposit money in a Recurring Deposit (RD)?",
      optionA: "A single lump-sum payment",
      optionB: "By depositing a fixed small amount every month",
      optionC: "Once a year only",
      optionD: "Cash only",
      correctOption: "b",
      explanation: "RDs require fixed regular monthly contributions.",
    },
    {
      slug: "fd-rd-explained",
      question: "What happens if you withdraw an FD before maturity?",
      optionA: "You receive an extra bonus",
      optionB: "A premature withdrawal penalty or lower interest rate may apply",
      optionC: "Nothing happens",
      optionD: "The account gets blocked",
      correctOption: "b",
      explanation: "Early FD withdrawals typically attract penalties or lower interest.",
    },
    {
      slug: "loans-and-emi",
      question: "What is included in an EMI payment?",
      optionA: "Principal only",
      optionB: "Interest only",
      optionC: "Both principal and interest components",
      optionD: "Penalties only",
      correctOption: "c",
      explanation: "EMIs consist of principal repayment plus interest.",
    },
    {
      slug: "loans-and-emi",
      question: "What is crucial to evaluate before taking a loan?",
      optionA: "Only the monthly EMI amount",
      optionB: "Total repayment amount and interest cost",
      optionC: "The bank logo",
      optionD: "Nothing specific",
      correctOption: "b",
      explanation: "Always check total cost of borrowing, not just monthly EMI.",
    },
    {
      slug: "insurance-basics",
      question: "What is an insurance premium?",
      optionA: "The payout received after a claim",
      optionB: "A regular payment made in exchange for insurance coverage",
      optionC: "A type of loan",
      optionD: "A bank service charge",
      correctOption: "b",
      explanation: "Premiums are paid to keep insurance coverage active.",
    },
    {
      slug: "digital-banking-safety",
      question: "Who should you share your OTP with?",
      optionA: "Bank employees over phone call",
      optionB: "No one",
      optionC: "Family members only",
      optionD: "Anyone who requests it",
      correctOption: "b",
      explanation: "OTPs are private security credentials and should never be shared.",
    },
    {
      slug: "digital-banking-safety",
      question: "What is the best response to an urgent threatening SMS about account blocking?",
      optionA: "Click the link immediately",
      optionB: "Panic and share your OTP",
      optionC: "Verify directly through official bank channels",
      optionD: "Forward the message",
      correctOption: "c",
      explanation: "Always verify account alerts through official bank apps or branches.",
    },
  ];

  const questionRows = quizSeeds
    .map((q) => {
      const lesson = lessonBySlug.get(q.slug);
      if (!lesson) return null;
      const { slug: _slug, ...rest } = q;
      void _slug;
      return { ...rest, lessonId: lesson.id };
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);

  if (questionRows.length > 0) {
    await db.insert(quizQuestions).values(questionRows).onConflictDoNothing();
  }

  // ---------- Scam Scenarios ----------
  const scamSeeds = [
    {
      title: "Fake KYC Blocking Message",
      category: "Fake KYC",
      difficulty: "easy",
      channel: "SMS",
      message: "Dear Customer, your account will be BLOCKED today. Click here to complete your KYC immediately: bit.ly/kyc-verify-now",
      context: "You receive an urgent SMS claiming your bank account will be blocked today.",
      options: [
        "Click the link to complete KYC",
        "Ignore the message and verify via official bank app or branch",
        "Forward link to friends to warn them",
        "Enter account number and OTP on link",
      ],
      correctOptionIndex: 1,
      explanation:
        "This is a classic phishing scam. Official banks never request KYC updates via SMS links.",
      safetyLesson: "Always verify urgent account threats via official banking channels.",
      orderIndex: 1,
    },
    {
      title: "OTP Sharing Call Scam",
      category: "OTP Scam",
      difficulty: "easy",
      channel: "Phone Call",
      message: "Caller: 'I am calling from your bank to verify your card. Please share the OTP sent to your phone.'",
      context: "An unknown caller claims to be a bank official.",
      options: [
        "Share the OTP because they claim to be from the bank",
        "Hang up immediately and do not share OTP",
        "Share only the last 3 digits",
        "Send OTP via WhatsApp",
      ],
      correctOptionIndex: 1,
      explanation: "Bank employees never ask for OTPs over phone calls.",
      safetyLesson: "Never share your OTP with anyone under any circumstances.",
      orderIndex: 2,
    },
    {
      title: "Fake Customer Care Number",
      category: "Fake Customer Care",
      difficulty: "medium",
      channel: "Google Search",
      message: "Searching for 'XYZ Bank customer care number' online yields unverified contact details.",
      context: "You are looking for customer support online to resolve a refund issue.",
      options: [
        "Call the first number found online",
        "Verify numbers only from the bank's official website or app",
        "Try a number found in social media comments",
        "Share details on any phone number",
      ],
      correctOptionIndex: 1,
      explanation: "Fraudsters post fake helpline numbers online. Always use verified numbers from official sources.",
      safetyLesson: "Obtain helpline numbers directly from official apps, websites, or passbooks.",
      orderIndex: 3,
    },
    {
      title: "Suspicious QR Code Payment",
      category: "QR Code Scam",
      difficulty: "medium",
      channel: "WhatsApp",
      message: "'You received a ₹5,000 cashback! Scan this QR code and enter your UPI PIN to claim.'",
      context: "A WhatsApp message promises instant cashback via QR scan.",
      options: [
        "Scan QR and enter PIN to claim",
        "Recognize that receiving money NEVER requires entering a PIN",
        "Forward QR to others",
        "Scan QR and decide PIN later",
      ],
      correctOptionIndex: 1,
      explanation: "Receiving payments never requires entering a UPI PIN. Scanning a QR and entering a PIN sends money away.",
      safetyLesson: "Requests asking for a PIN to receive cashback are always scams.",
      orderIndex: 4,
    },
    {
      title: "UPI Collect Request Trap",
      category: "UPI Scam",
      difficulty: "easy",
      channel: "UPI App",
      message: "A notification appears in your UPI app for a ₹1 collect request marked 'Refund - approve now'.",
      context: "You receive a payment request notification in your UPI app.",
      options: [
        "Approve the request since it is only ₹1",
        "Decline the request — refunds do not use collect requests",
        "Call the sender to ask",
        "Approve to see what happens",
      ],
      correctOptionIndex: 1,
      explanation: "Collect requests transfer money OUT of your account.",
      safetyLesson: "Decline unfamiliar collect requests immediately.",
      orderIndex: 5,
    },
    {
      title: "Fake Instant Loan Offer",
      category: "Fake Loan Offer",
      difficulty: "medium",
      channel: "SMS",
      message: "'Congratulations! Pre-approved loan of ₹2,00,000! Pay ₹999 advance processing fee to disburse.'",
      context: "An unsolicited SMS offers instant pre-approved loans for an advance fee.",
      options: [
        "Pay the advance fee immediately to get the loan",
        "Understand that advance fee loan offers are fraudulent",
        "Send Aadhaar details for verification",
        "Pay fee and request receipt",
      ],
      correctOptionIndex: 1,
      explanation: "Legitimate lenders do not ask for advance fee payments before loan disburse.",
      safetyLesson: "Any loan offer demanding advance fees is fraudulent.",
      orderIndex: 6,
    },
    {
      title: "Screen Sharing App Request",
      category: "Screen Sharing Scam",
      difficulty: "advanced",
      channel: "Phone Call",
      message: "Caller: 'Your payment failed. Install AnyDesk to help resolve the issue.'",
      context: "A caller asks you to install a screen-sharing app for assistance.",
      options: [
        "Install the app to get help",
        "Do not install; hang up and contact your bank directly",
        "Install app and open mobile banking",
        "Install just once",
      ],
      correctOptionIndex: 1,
      explanation: "Screen sharing allows scammers to view your banking screens and OTPs.",
      safetyLesson: "Never install remote screen-sharing apps on instructions from unknown callers.",
      orderIndex: 7,
    },
    {
      title: "Fake Job Offer Advance Payment",
      category: "Job/Investment Scam",
      difficulty: "medium",
      channel: "WhatsApp",
      message: "'Work from home job ₹30,000/month. Send ₹500 registration fee to begin.'",
      context: "A job offer demands upfront registration fees.",
      options: [
        "Pay registration fee to secure the job",
        "Recognize that legitimate job offers do not demand money",
        "Send bank details",
        "Invite friends to join",
      ],
      correctOptionIndex: 1,
      explanation: "Genuine employers never demand money for job opportunities.",
      safetyLesson: "Job offers requiring advance payment are scams.",
      orderIndex: 8,
    },
    {
      title: "SIM Swap Warning Call",
      category: "SIM Fraud",
      difficulty: "advanced",
      channel: "Phone Call",
      message: "Caller: 'Upgrade your SIM to 5G. Provide your 20-digit SIM number and forward the SMS.'",
      context: "A caller requests SIM details under the guise of an upgrade.",
      options: [
        "Provide SIM number for free upgrade",
        "Refuse details; visit official telecom store directly",
        "Forward the SMS as instructed",
        "Trust caller and provide details",
      ],
      correctOptionIndex: 1,
      explanation: "SIM swap fraud allows scammers to hijack your mobile number and intercept OTPs.",
      safetyLesson: "Handle SIM changes only through official telecom operator stores.",
      orderIndex: 9,
    },
    {
      title: "Impersonation as Bank Manager",
      category: "Impersonation",
      difficulty: "medium",
      channel: "WhatsApp",
      message: "'I am your branch manager. Send ₹1 via UPI to verify your account.'",
      context: "A message claims to be from a bank manager asking for a payment.",
      options: [
        "Send ₹1 as requested",
        "Verify manager identity directly at branch or official contact",
        "Save number and send money",
        "Share PIN to verify",
      ],
      correctOptionIndex: 1,
      explanation: "Bank managers do not request personal UPI payments via chat apps.",
      safetyLesson: "Verify claims of bank authority via official branch channels.",
      orderIndex: 10,
    },
  ];

  await db.insert(scamScenarios).values(scamSeeds).onConflictDoNothing();

  // ---------- Glossary Terms ----------
  const glossarySeeds = [
    { term: "IFSC", simpleMeaning: "A unique code identifying a specific bank branch.", usedFor: "NEFT, RTGS, and IMPS electronic transfers.", category: "Banking Basics" },
    { term: "MICR", simpleMeaning: "A unique code used for magnetic character cheque processing.", usedFor: "Cheque clearance and validation.", category: "Banking Basics" },
    { term: "NEFT", simpleMeaning: "A nationwide electronic batch-processed money transfer system.", usedFor: "Standard bank fund transfers.", category: "Payments" },
    { term: "RTGS", simpleMeaning: "Real-time gross settlement system for high-value transfers.", usedFor: "High-value transfers typically ₹2 Lakh and above.", category: "Payments" },
    { term: "IMPS", simpleMeaning: "An instant 24/7 electronic fund transfer service.", usedFor: "Immediate fund transfers anytime.", category: "Payments" },
    { term: "EMI", simpleMeaning: "A fixed monthly installment paid to repay a loan.", usedFor: "Loan principal and interest repayment.", category: "Loans" },
    { term: "Principal", simpleMeaning: "The original sum of money deposited or borrowed.", usedFor: "Loan and investment calculations.", category: "General" },
    { term: "Interest", simpleMeaning: "The fee charged for borrowing or earned for saving money.", usedFor: "Savings accounts, FDs, RDs, and loans.", category: "General" },
    { term: "Tenure", simpleMeaning: "The total duration of a financial agreement or contract.", usedFor: "Loan terms, FD, and RD periods.", category: "General" },
    { term: "KYC", simpleMeaning: "Process used by banks to verify customer identity.", usedFor: "Account setup and fraud prevention.", category: "Banking Basics" },
    { term: "Nominee", simpleMeaning: "Designated individual eligible to receive account benefits upon holder's death.", usedFor: "Bank accounts and insurance policies.", category: "General" },
    { term: "Maturity", simpleMeaning: "The date when a financial deposit or policy term completes.", usedFor: "Fixed deposits, RDs, and insurance.", category: "Financial Products" },
    { term: "Premium", simpleMeaning: "Regular payment made to maintain insurance coverage.", usedFor: "Health, life, and risk insurance policies.", category: "Insurance" },
    { term: "Deductible", simpleMeaning: "Amount the insured must pay out-of-pocket before insurance kicks in.", usedFor: "Insurance claims.", category: "Insurance" },
    { term: "Minimum Balance", simpleMeaning: "Minimum average balance required in a bank account.", usedFor: "Avoiding account non-maintenance fees.", category: "Banking Basics" },
    { term: "UPI PIN", simpleMeaning: "Confidential PIN used to authorize sending money via UPI.", usedFor: "Authenticating outgoing UPI transactions.", category: "UPI" },
    { term: "CVV", simpleMeaning: "3-digit security code on the back of a debit/credit card.", usedFor: "Verifying online card payments.", category: "Cards" },
    { term: "OTP", simpleMeaning: "One-Time Password sent to authenticate transactions.", usedFor: "Secure login and transaction authorization.", category: "Digital Safety" },
    { term: "Overdraft", simpleMeaning: "A facility allowing account withdrawals beyond available balance up to a limit.", usedFor: "Short-term financial flexibility.", category: "Banking Basics" },
    { term: "Credit Score", simpleMeaning: "Numerical summary of credit history evaluating borrowing reliability.", usedFor: "Loan and credit card approvals.", category: "Loans" },
  ];

  await db.insert(glossaryTerms).values(glossarySeeds).onConflictDoNothing();

  // ---------- Badges ----------
  const badgeSeeds = [
    { code: "first_lesson", name: "First Lesson Badge", description: "Completed your first lesson!", icon: "🎉", xpReward: 10 },
    { code: "banking_basics_master", name: "Banking Basics Master", description: "Completed 5 or more lessons.", icon: "🏦", xpReward: 30 },
    { code: "scam_detective", name: "Scam Detective", description: "Correctly identified 3 scam scenarios.", icon: "🕵️", xpReward: 25 },
    { code: "safety_champion", name: "Financial Safety Champion", description: "Solved 5+ scam scenarios with high accuracy.", icon: "🛡️", xpReward: 40 },
    { code: "smart_saver", name: "Smart Saver", description: "Used the Financial Simulator.", icon: "💰", xpReward: 15 },
    { code: "quiz_whiz", name: "Quiz Whiz", description: "Completed 5 learning quizzes.", icon: "🧠", xpReward: 30 },
  ];

  await db.insert(badges).values(badgeSeeds).onConflictDoNothing();

  // ---------- Demo Users ----------
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const learnerPasswordHash = await bcrypt.hash("Learner@123", 10);

  const [adminUser] = await db
    .insert(users)
    .values({
      name: "FinTell Admin",
      email: "admin@fintell.app",
      passwordHash: adminPasswordHash,
      role: "admin",
      language: "en",
      experienceLevel: "basic",
      onboarded: true,
      xp: 50,
    })
    .onConflictDoNothing()
    .returning();

  const [learnerUser] = await db
    .insert(users)
    .values({
      name: "Priya Sharma",
      email: "priya@fintell.app",
      passwordHash: learnerPasswordHash,
      role: "user",
      language: "en",
      experienceLevel: "new",
      onboarded: true,
      xp: 95,
    })
    .onConflictDoNothing()
    .returning();

  if (adminUser) {
    await db
      .insert(moneyProfiles)
      .values({
        userId: adminUser.id,
        monthlyIncome: 75000,
        fixedExpenses: 28000,
        variableExpenses: 15000,
        existingDebtEmi: 8000,
        savingsGoalName: "Family emergency fund",
        savingsGoalAmount: 200000,
        currentSavings: 65000,
        preferredMonthlySaving: 15000,
        monthlyFinancialGoal: "emergency_fund",
        bufferPreference: 45,
      })
      .onConflictDoNothing();
  }

  if (learnerUser) {
    await db
      .insert(moneyProfiles)
      .values({
        userId: learnerUser.id,
        monthlyIncome: 20000,
        fixedExpenses: 10000,
        variableExpenses: 4000,
        existingDebtEmi: 0,
        savingsGoalName: "Emergency fund",
        savingsGoalAmount: 30000,
        currentSavings: 7500,
        preferredMonthlySaving: 2500,
        monthlyFinancialGoal: "emergency_fund",
        bufferPreference: 55,
      })
      .onConflictDoNothing();

    await db
      .insert(monthlyMoneyProgress)
      .values([
        {
          userId: learnerUser.id,
          monthKey: "2026-01",
          plannedSaving: 2500,
          actualSaving: 2200,
          actualFixedExpenses: 10000,
          actualVariableExpenses: 4300,
          note: "Medicine expense increased variable spending.",
        },
        {
          userId: learnerUser.id,
          monthKey: "2026-02",
          plannedSaving: 2500,
          actualSaving: 2700,
          actualFixedExpenses: 10000,
          actualVariableExpenses: 3800,
          note: "Reduced small daily snacks and saved more.",
        },
        {
          userId: learnerUser.id,
          monthKey: "2026-03",
          plannedSaving: 2500,
          actualSaving: 2300,
          actualFixedExpenses: 10000,
          actualVariableExpenses: 4200,
          note: "Travel cost was higher this month.",
        },
      ])
      .onConflictDoNothing();
  }

  // ---------- Demo Progress for Learner ----------
  if (learnerUser) {
    const finalLessons = await db.select().from(lessons);
    const finalQuestions = await db.select().from(quizQuestions);
    const finalBadges = await db.select().from(badges);
    const finalScams = await db.select().from(scamScenarios);

    const lessonsToComplete = finalLessons
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .slice(0, 4);

    for (const lesson of lessonsToComplete) {
      const qs = finalQuestions.filter((q) => q.lessonId === lesson.id);
      const correctCount = qs.length > 0 ? Math.max(1, qs.length - 1) : null;
      await db
        .insert(lessonProgress)
        .values({
          userId: learnerUser.id,
          lessonId: lesson.id,
          completed: true,
          quizScore: correctCount,
          quizTotal: qs.length || null,
          completedAt: new Date(),
        })
        .onConflictDoNothing();
    }

    const scamsToAttempt = finalScams.slice(0, 5);
    for (let i = 0; i < scamsToAttempt.length; i++) {
      const scenario = scamsToAttempt[i];
      const correct = i !== 1; // make one wrong for realism
      await db.insert(scamAttempts).values({
        userId: learnerUser.id,
        scenarioId: scenario.id,
        chosenIndex: correct ? scenario.correctOptionIndex : (scenario.correctOptionIndex + 1) % scenario.options.length,
        correct,
      });
    }

    const earnableBadgeCodes = ["first_lesson", "smart_saver"];
    for (const code of earnableBadgeCodes) {
      const badge = finalBadges.find((b) => b.code === code);
      if (badge) {
        await db.insert(userBadges).values({ userId: learnerUser.id, badgeId: badge.id }).onConflictDoNothing();
      }
    }
  }

  void adminUser;

  console.log("Seeding complete!");
  console.log("Demo admin login: admin@fintell.app / Admin@123");
  console.log("Demo learner login: priya@fintell.app / Learner@123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
