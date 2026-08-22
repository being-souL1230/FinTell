// Controlled financial-literacy knowledge base used by the AI Assistant.
// The assistant always prefers this curated, safe content over an open-ended
// LLM call, so answers stay accurate, on-topic and jargon-free.

export type KbEntry = {
  keywords: string[];
  question: string;
  answer: string;
};

export const KNOWLEDGE_BASE: KbEntry[] = [
  {
    keywords: ["emi", "equated monthly"],
    question: "What is an EMI?",
    answer:
      "An EMI (Equated Monthly Installment) is a fixed amount paid to the bank every month to repay a loan. It includes both the principal amount and the interest. Initially, a larger portion goes toward interest, and over time, more goes toward repaying the principal. You can use the EMI Simulator to estimate your monthly EMI by entering the loan amount, interest rate, and tenure.",
  },
  {
    keywords: ["fd", "fixed deposit"],
    question: "What is a Fixed Deposit (FD)?",
    answer:
      "A Fixed Deposit (FD) is an investment where you deposit a fixed sum with a bank for a specified tenure at a guaranteed interest rate. Upon completion of the tenure (maturity), you receive the principal plus accumulated interest. Withdrawing money early (premature withdrawal) may incur a penalty. FDs offer higher interest than a standard savings account while keeping your funds secure.",
  },
  {
    keywords: ["rd", "recurring deposit"],
    question: "What is a Recurring Deposit (RD)?",
    answer:
      "A Recurring Deposit (RD) allows you to deposit a fixed small amount every month for a set tenure. At maturity, you receive your total deposits along with interest. It is ideal for individuals who want to save regularly every month rather than depositing a large lump sum.",
  },
  {
    keywords: ["upi pin", "upi safety", "collect request"],
    question: "When should I enter my UPI PIN?",
    answer:
      "You should enter your UPI PIN ONLY when SENDING money to someone. You NEVER need to enter a UPI PIN to RECEIVE money. If you receive a 'collect request' asking for your UPI PIN, it is a potential scam — decline it immediately and never share your PIN.",
  },
  {
    keywords: ["upi", "unified payments"],
    question: "What is UPI?",
    answer:
      "UPI (Unified Payments Interface) is an instant real-time payment system that allows bank-to-bank money transfers using a mobile device via UPI ID or QR code. It operates 24/7. Golden Safety Rule: A PIN is required to send money, NEVER to receive money.",
  },
  {
    keywords: ["kyc", "know your customer"],
    question: "What is KYC?",
    answer:
      "KYC (Know Your Customer) is a mandatory identity verification process used by banks (requiring documents like Aadhaar, PAN, or address proof) to prevent fraud. Remember: Banks never perform KYC updates via SMS links, phone calls, or WhatsApp — genuine KYC is done through official bank branches, official apps, or verified websites.",
  },
  {
    keywords: ["ifsc"],
    question: "What is an IFSC code?",
    answer:
      "An IFSC (Indian Financial System Code) is an 11-character alphanumeric code that uniquely identifies a bank branch. It is required for electronic fund transfers such as NEFT, RTGS, and IMPS, and can be found on your passbook or cheque book.",
  },
  {
    keywords: ["neft"],
    question: "What is NEFT?",
    answer:
      "NEFT (National Electronic Funds Transfer) is a nationwide payment system for electronic money transfers. Transactions are processed in batches, so funds usually reach the beneficiary within a few minutes to hours. There is no minimum transaction limit.",
  },
  {
    keywords: ["rtgs"],
    question: "What is RTGS?",
    answer:
      "RTGS (Real Time Gross Settlement) is used for high-value instant money transfers (typically ₹2 Lakh or more). Each transaction is settled individually and continuously in real-time.",
  },
  {
    keywords: ["imps"],
    question: "What is IMPS?",
    answer:
      "IMPS (Immediate Payment Service) enables instant 24/7 electronic fund transfers between banks across India, including on bank holidays.",
  },
  {
    keywords: ["interest"],
    question: "What is interest?",
    answer:
      "Interest is the cost of borrowing money or the reward for saving money. When you save money in a bank, the bank pays you interest. When you borrow money via a loan, you pay interest to the bank. It is expressed as an annual percentage rate (%).",
  },
  {
    keywords: ["minimum balance"],
    question: "What is minimum balance?",
    answer:
      "Minimum balance (or Average Monthly Balance) is the minimum average amount you must maintain in your savings account. Falling below this limit may attract non-maintenance charges. Check with your bank for specific rules, as basic accounts (like Jan Dhan) often have zero minimum balance requirements.",
  },
  {
    keywords: ["otp", "one time password"],
    question: "Why should I never share my OTP?",
    answer:
      "An OTP (One Time Password) is a confidential security code sent to verify YOUR identity during transactions. Bank employees, police, or official representatives will NEVER ask for your OTP. Sharing an OTP allows fraudsters to withdraw money from your account instantly.",
  },
  {
    keywords: ["premium", "insurance"],
    question: "What is an insurance premium?",
    answer:
      "An insurance premium is the regular amount paid to an insurance company in exchange for financial coverage against specific risks (such as illness or accidents). Insurance is a risk protection tool, not an investment.",
  },
  {
    keywords: ["nominee"],
    question: "What is a nominee?",
    answer:
      "A nominee is a designated person who is entitled to receive the account funds or insurance benefits in the event of the account holder's death. Adding a nominee to every financial account is strongly recommended.",
  },
  {
    keywords: ["maturity"],
    question: "What is maturity?",
    answer:
      "Maturity refers to the date on which a financial contract (like an FD, RD, or policy) ends and the principal along with accumulated interest/benefits becomes payable to you.",
  },
  {
    keywords: ["principal"],
    question: "What is principal?",
    answer:
      "Principal is the original sum of money invested, deposited, or borrowed, excluding any interest or earnings.",
  },
  {
    keywords: ["tenure"],
    question: "What is tenure?",
    answer:
      "Tenure is the agreed duration or term for which a financial product (such as a loan, FD, or RD) remains active.",
  },
  {
    keywords: ["cvv"],
    question: "What is a CVV and should I share it?",
    answer:
      "A CVV is a 3-digit security code printed on the back of your debit/credit card used to authenticate online card transactions. NEVER share your CVV over calls, SMS, or emails — bank officials will never ask for your CVV.",
  },
  {
    keywords: ["phishing", "fake link", "fraud link"],
    question: "What is phishing?",
    answer:
      "Phishing is a fraudulent attempt to obtain sensitive information (such as login credentials or OTPs) by impersonating a trustworthy bank via fake SMS, emails, or links. Always log in directly via official bank apps or verified web URLs.",
  },
  {
    keywords: ["budget", "budgeting"],
    question: "How do I create a budget?",
    answer:
      "To create a budget: 1) List your monthly income. 2) Track essential fixed expenses (rent, utilities, groceries). 3) Allocate remaining funds toward savings and financial goals. Use FinTell's Savings Simulator to plan and track your monthly budget effectively.",
  },
];

export function searchKnowledgeBase(query: string): KbEntry | null {
  const normalized = query.toLowerCase();
  let best: { entry: KbEntry; score: number } | null = null;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        score += keyword.length; // longer/more specific matches score higher
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best?.entry ?? null;
}

export const AI_SAFETY_NOTICE =
  "I provide educational information only, not personalized financial advice. Please read official terms before choosing any financial product and consult a qualified advisor if needed. I will never ask for your OTP, PIN, password, or CVV — and you should never share them with anyone.";
