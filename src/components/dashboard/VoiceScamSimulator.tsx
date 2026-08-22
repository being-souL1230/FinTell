"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Volume2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  UserCheck,
  Lock,
  Mic,
  MicOff,
  Clock,
  ShieldCheck,
  HelpCircle,
  XCircle,
  Activity,
  AlertCircle,
} from "lucide-react";

interface CallScenario {
  id: string;
  title: string;
  callerName: string;
  callerNumber: string;
  urgencyLevel: "CRITICAL_PANIC" | "LEGAL_EXTORTION" | "BANK_URGENCY" | "REFUND_TRAP" | "UTILITY_THREAT" | "CUSTOMS_FRAUD";
  threatScore: number; // out of 100
  audioTranscript: string;
  redFlags: string[];
  scammerGoal: string;
  realWorldAction: string;
  options: {
    text: string;
    isSafe: boolean;
    explanation: string;
  }[];
}

const CALL_SCENARIOS: CallScenario[] = [
  {
    id: "call-1",
    title: "Urgent Hospital Emergency Panic Call",
    callerName: "City Care Hospital Emergency Dept",
    callerNumber: "+91 98765 01234",
    urgencyLevel: "CRITICAL_PANIC",
    threatScore: 95,
    audioTranscript:
      "Hello! Listen carefully! Your relative Rakesh has been admitted after a critical road accident. He is bleeding heavily in the ICU. An emergency deposit of ₹15,000 is needed right now to begin blood transfusion and emergency surgery. Transfer money to this doctor's UPI ID immediately or we cannot proceed!",
    redFlags: [
      "Extremely panic-inducing claim about immediate medical danger",
      "Demands instant UPI transfer to a personal account",
      "Creates artificial deadline ('surgery won't start')",
      "Refuses to let you call back official hospital numbers",
    ],
    scammerGoal: "Exploit your emotional panic to steal ₹15,000 via UPI before you can verify facts.",
    realWorldAction: "Disconnect instantly. Call Rakesh directly, or search and dial official hospital desk lines.",
    options: [
      {
        text: "Panic and immediately send ₹15,000 to the doctor's UPI ID",
        isSafe: false,
        explanation: "DANGEROUS TRAP! Fraudsters weaponize life-and-death panic. Hospitals never refuse emergency care for lack of an instant personal UPI transfer.",
      },
      {
        text: "Ask for the doctor's name and UPI details, then hang up to verify with family",
        isSafe: true,
        explanation: "CORRECT & SAFE! Always disconnect the call, contact your family directly, or reach out to the official hospital reception.",
      },
      {
        text: "Argue with the caller about payment policy while staying on the line",
        isSafe: false,
        explanation: "RISKY! Staying on the phone keeps your mind in panic state and gives the scammer more opportunities to manipulate you.",
      },
    ],
  },
  {
    id: "call-2",
    title: "Fake CBI / Police Digital Arrest Call",
    callerName: "CBI Cyber Crime Cell — Inspector Sharma",
    callerNumber: "+91 91234 56789",
    urgencyLevel: "LEGAL_EXTORTION",
    threatScore: 98,
    audioTranscript:
      "This is Inspector Sharma from Central Crime Branch Delhi. A high-priority legal warrant is issued against your Aadhaar number. A courier package containing illegal narcotics and fake passports was intercepted in Mumbai. You are under Digital Arrest! Switch on video call immediately or local police will raid your house in 20 minutes!",
    redFlags: [
      "Mentions non-existent legal concept of 'Digital Arrest'",
      "Claims police investigation happens over Skype/WhatsApp video call",
      "Uses legal jargon and threats of immediate raid/jail",
      "Demands secret financial transfer for 'verification clearance'",
    ],
    scammerGoal: "Isolate you on video call, intimidate you with fake uniforms, and force money transfer to avoid jail.",
    realWorldAction: "Hang up immediately. Indian Police & Law Enforcement NEVER conduct arrests via video calls.",
    options: [
      {
        text: "Comply immediately, join video call and pay clearance fees to avoid arrest",
        isSafe: false,
        explanation: "CRITICAL FAILURE! Indian Law Enforcement agencies DO NOT conduct 'Digital Arrests' over WhatsApp or Skype video calls.",
      },
      {
        text: "Hang up immediately, dial Cyber Crime Helpline 1930, and inform local police",
        isSafe: true,
        explanation: "PERFECT DECISION! Real law enforcement sends official written summons, never threats over phone or online video calls.",
      },
      {
        text: "Offer to pay a smaller fine over phone to clear your name",
        isSafe: false,
        explanation: "WRONG! Paying any amount confirms you fell into their extortion trap, and scammers will demand even more.",
      },
    ],
  },
  {
    id: "call-3",
    title: "Bank Account Freeze & Urgent KYC Expiry",
    callerName: "HDFC Senior Risk Officer",
    callerNumber: "+91 80012 34567",
    urgencyLevel: "BANK_URGENCY",
    threatScore: 88,
    audioTranscript:
      "Alert from Bank Risk Desk! Your savings account and debit card are being permanently blocked in 30 minutes due to missing RBI KYC verification. To prevent debit restriction, tell me the 6-digit verification code just sent to your phone right now. Hurry, countdown has started!",
    redFlags: [
      "Claims account freeze deadline within 30 minutes",
      "Requests 6-digit OTP received on your mobile",
      "Impersonates official bank manager/risk officer",
      "Background noise mimics fake call center sounds",
    ],
    scammerGoal: "Steal your OTP to execute unauthorized net-banking transactions or drain your account.",
    realWorldAction: "Never share OTP with anyone. Banks never ask for OTP or passwords over phone calls.",
    options: [
      {
        text: "Read out the 6-digit OTP quickly to avoid bank account block",
        isSafe: false,
        explanation: "SEVERE RISK! OTP is your private key. Sharing OTP gives scammers direct access to withdraw your funds.",
      },
      {
        text: "Disconnect call immediately and visit your nearest bank branch or official app",
        isSafe: true,
        explanation: "EXCELLENT! Banks strictly advise that no employee will ever ask for OTPs, PINs, or CVV numbers over a phone call.",
      },
      {
        text: "Ask the caller to verify your account balance first to prove identity",
        isSafe: false,
        explanation: "UNSAFE! Scammers often buy leaked customer data and might already know basic details to gain your false trust.",
      },
    ],
  },
  {
    id: "call-4",
    title: "Insurance Policy Cash Refund & Bonus Fraud",
    callerName: "IRDAI Claims Department",
    callerNumber: "+91 99887 76655",
    urgencyLevel: "REFUND_TRAP",
    threatScore: 82,
    audioTranscript:
      "Congratulations! The Insurance Regulatory Authority has approved a unclaimed bonus refund of ₹2,45,000 on your old lapsed policy. To deposit this fund directly into your bank, pay a nominal processing GST fee of ₹4,999 through the UPI link sent to your SMS.",
    redFlags: [
      "Offers unexpected large monetary windfall or policy bonus",
      "Demands upfront 'processing fee' or GST payment to release funds",
      "Impersonates regulatory bodies like IRDAI or RBI",
      "Urges immediate action before 'bonus allocation expires'",
    ],
    scammerGoal: "Trick you into paying 'upfront tax' or scanning a payment QR code that debits money from your account.",
    realWorldAction: "Remember: You NEVER need to pay money or enter UPI PIN to receive money.",
    options: [
      {
        text: "Click the SMS link and pay ₹4,999 GST fee to claim ₹2.45 Lakhs",
        isSafe: false,
        explanation: "WRONG! Legitimate refunds never require upfront payment. Any request to pay money to receive money is 100% fraud.",
      },
      {
        text: "Refuse payment, block the caller, and check official insurance portal directly",
        isSafe: true,
        explanation: "SPOT ON! IRDAI and insurance companies never demand upfront fee transfers for bonus releases.",
      },
      {
        text: "Share bank account number and UPI PIN for direct credit",
        isSafe: false,
        explanation: "DANGEROUS! Entering your UPI PIN always DEDUCTS money from your account; it never receives money.",
      },
    ],
  },
  {
    id: "call-5",
    title: "Electricity Board Instant Power Cut Threat",
    callerName: "State Electricity Distribution Officer",
    callerNumber: "+91 97112 23344",
    urgencyLevel: "UTILITY_THREAT",
    threatScore: 90,
    audioTranscript:
      "Notice from Electricity Department! Your power connection will be disconnected tonight at 9:30 PM due to unpaid balance of ₹3,240. Pay immediately using the APK app link sent via SMS, or electricity line will be cut and re-connection fee of ₹10,000 charged tomorrow!",
    redFlags: [
      "Threatens immediate power disconnection within hours",
      "Asks to install custom `.apk` app file sent on SMS/WhatsApp",
      "Demands instant payment outside official bill payment portals",
      "Uses aggressive tone to suppress questioning",
    ],
    scammerGoal: "Force you to install malicious APK spyware that captures banking credentials and SMS OTPs.",
    realWorldAction: "Pay utility bills ONLY through official utility websites, apps (e.g. Mahavitaran/BSES/Tata Power), or authorized apps like PhonePe/GPay.",
    options: [
      {
        text: "Download the APK app sent on SMS and pay ₹3,240 right away",
        isSafe: false,
        explanation: "EXTREME RISK! Installing untrusted `.apk` files installs remote access malware that steals bank credentials.",
      },
      {
        text: "Hang up, ignore SMS links, and check your official electricity provider portal",
        isSafe: true,
        explanation: "CORRECT! Electricity boards issue formal written notices on official bills, not instant disconnection threats via personal SMS/calls.",
      },
      {
        text: "Ask caller to send a QR code directly on WhatsApp for quick payment",
        isSafe: false,
        explanation: "RISKY! Scammers will send a fake payment QR code that drains money directly from your UPI app.",
      },
    ],
  },
  {
    id: "call-6",
    title: "International Customs Courier Contraband Scam",
    callerName: "FedEx International Customs Desk",
    callerNumber: "+91 88001 99228",
    urgencyLevel: "CUSTOMS_FRAUD",
    threatScore: 94,
    audioTranscript:
      "Attention! A FedEx parcel dispatched from Mumbai to Taiwan containing 5 illegal credit cards, 200g MDMA, and stolen documents under your Aadhaar has been seized by Customs. Transfer your case to Narcotics Control Bureau immediately or face non-bailable warrant!",
    redFlags: [
      "Claims parcel with illegal items sent in your name overseas",
      "Combines courier company name with law enforcement threats",
      "Demands 'clearance money' to avoid arrest by Narcotics Bureau",
      "Keeps you on hold continuously so you can't double-check",
    ],
    scammerGoal: "Extort huge sums of money by threatening fake non-bailable warrants and drug trafficking charges.",
    realWorldAction: "Courier companies never call demanding money for contraband clearance. Contact local police or report on 1930 helpline.",
    options: [
      {
        text: "Panic and request an out-of-court settlement via online payment",
        isSafe: false,
        explanation: "SCAM TRAP! Courier companies have no legal authority to demand money or settle criminal cases over phone.",
      },
      {
        text: "Hang up, block sender, and report details on Cyber Crime Portal (cybercrime.gov.in)",
        isSafe: true,
        explanation: "BRAVO! Disconnecting immediately shuts down cyber extortion attempts. Report scam numbers to 1930.",
      },
      {
        text: "Stay on call to convince the caller that you didn't send any package",
        isSafe: false,
        explanation: "INEFFECTIVE! Scammers use scripts to manipulate and escalate pressure until you yield.",
      },
    ],
  },
];

export function VoiceScamSimulator() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [callState, setCallState] = useState<"IDLE" | "RINGING" | "CONNECTED" | "DECLINED" | "RESOLVED">("IDLE");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Live timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect state
  const [displayedTranscript, setDisplayedTranscript] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [revealedFlagsCount, setRevealedFlagsCount] = useState(0);

  const scenario = CALL_SCENARIOS[activeScenarioIndex];

  // Simulated Ringing Sound Effect using Web Audio API
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callState === "RINGING") {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        interval = setInterval(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.value = 440;
          gain.gain.value = 0.08;
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.4);
        }, 1200);
      } catch (e) {}
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Live Call Timer Effect
  useEffect(() => {
    if (callState === "CONNECTED") {
      setSecondsElapsed(0);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Typewriter Effect & Progressive Red Flags Effect
  useEffect(() => {
    if (callState === "CONNECTED") {
      setDisplayedTranscript("");
      setIsTyping(true);
      setRevealedFlagsCount(1);

      let charIndex = 0;
      const fullText = scenario.audioTranscript;
      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setDisplayedTranscript(fullText.substring(0, charIndex + 1));
          charIndex++;

          // Progressive Red Flags reveal based on transcript progress
          const progress = charIndex / fullText.length;
          if (progress > 0.3 && progress <= 0.6) setRevealedFlagsCount(2);
          else if (progress > 0.6 && progress <= 0.85) setRevealedFlagsCount(3);
          else if (progress > 0.85) setRevealedFlagsCount(scenario.redFlags.length);
        } else {
          setIsTyping(false);
          setRevealedFlagsCount(scenario.redFlags.length);
          clearInterval(typingInterval);
        }
      }, 25);

      return () => clearInterval(typingInterval);
    }
  }, [callState, activeScenarioIndex, scenario]);

  const startCall = () => {
    setCallState("RINGING");
    setSelectedOption(null);
    setDisplayedTranscript("");
  };

  const answerCall = () => {
    setCallState("CONNECTED");
  };

  const declineCall = () => {
    setCallState("DECLINED");
  };

  const handleChoice = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    setCallState("RESOLVED");
  };

  const nextScenario = () => {
    setActiveScenarioIndex((prev) => (prev + 1) % CALL_SCENARIOS.length);
    setCallState("IDLE");
    setSelectedOption(null);
    setDisplayedTranscript("");
    setSecondsElapsed(0);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  const getUrgencyBadge = (level: CallScenario["urgencyLevel"]) => {
    switch (level) {
      case "CRITICAL_PANIC":
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-black uppercase">Critical Panic Scam</span>;
      case "LEGAL_EXTORTION":
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 text-[10px] font-black uppercase">Legal Extortion</span>;
      case "BANK_URGENCY":
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black uppercase">Bank KYC Scam</span>;
      case "REFUND_TRAP":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase">Bonus Refund Trap</span>;
      case "UTILITY_THREAT":
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 text-[10px] font-black uppercase">Utility Disconnection</span>;
      case "CUSTOMS_FRAUD":
        return <span className="bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-0.5 text-[10px] font-black uppercase">Customs Courier Fraud</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER & SCENARIO SELECTOR */}
      <div className="rounded-none border border-slate-200 bg-white p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>Emergency Voice Scam Simulator</span>
              <Volume2 className="h-4 w-4 text-red-600 animate-pulse" />
            </h2>
            <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-black px-2 py-0.5">
              Interactive Lab
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Experience realistic audio scam drills: panic calls, digital arrests, OTP frauds & utility threats.
          </p>
        </div>

        {/* SCENARIO SELECTOR BUTTONS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {CALL_SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScenarioIndex(idx);
                setCallState("IDLE");
                setSelectedOption(null);
                setDisplayedTranscript("");
              }}
              className={`rounded-none px-3 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeScenarioIndex === idx
                  ? "bg-slate-900 text-white shadow-xs ring-1 ring-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Drill {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN DUAL-PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT PANEL: SMARTPHONE CALL SCREEN SIMULATION (5 COLS) */}
        <div className="lg:col-span-5 rounded-none border-2 border-slate-900 bg-slate-950 p-6 text-white shadow-2xl flex flex-col justify-between min-h-[460px] relative overflow-hidden">
          
          {/* TOP STATUS BAR */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-800/80 pb-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Activity className="h-3 w-3 text-red-500 animate-pulse" /> FinTell Voice Lab
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Lock className="h-3 w-3" /> Encrypted Drill
            </span>
          </div>

          {/* STATE 1: IDLE */}
          {callState === "IDLE" && (
            <div className="py-10 text-center space-y-5 my-auto">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-4 ring-red-500/20 shadow-inner">
                <Phone className="h-10 w-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                {getUrgencyBadge(scenario.urgencyLevel)}
                <h3 className="text-base font-black text-white pt-2">{scenario.title}</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Caller: <span className="text-slate-200 font-semibold">{scenario.callerName}</span>
                </p>
              </div>

              <button
                onClick={startCall}
                className="inline-flex items-center gap-2 rounded-none bg-red-600 px-6 py-3 text-xs font-black text-white hover:bg-red-500 transition cursor-pointer shadow-lg hover:shadow-red-600/30"
              >
                <Phone className="h-4 w-4" /> Simulate Incoming Scam Call
              </button>
            </div>
          )}

          {/* STATE 2: RINGING */}
          {callState === "RINGING" && (
            <div className="py-8 text-center space-y-6 my-auto">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-red-600/30 animate-ping" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl ring-4 ring-red-400">
                  <Phone className="h-10 w-10 animate-bounce" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> INCOMING URGENT CALL
                </p>
                <h3 className="text-lg font-black text-white mt-1">{scenario.callerName}</h3>
                <p className="text-xs font-mono text-slate-300 tracking-wider mt-0.5">{scenario.callerNumber}</p>
                <div className="mt-2">{getUrgencyBadge(scenario.urgencyLevel)}</div>
              </div>

              {/* ACCEPT & DECLINE BUTTONS */}
              <div className="flex justify-center items-center gap-8 pt-4">
                <div className="text-center space-y-1">
                  <button
                    onClick={declineCall}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-700 text-white hover:bg-red-600 cursor-pointer shadow-lg transition transform hover:scale-105"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Decline</p>
                </div>

                <div className="text-center space-y-1">
                  <button
                    onClick={answerCall}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer shadow-lg transition transform hover:scale-105 animate-pulse"
                  >
                    <Phone className="h-6 w-6" />
                  </button>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Accept</p>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: DECLINED */}
          {callState === "DECLINED" && (
            <div className="py-10 text-center space-y-4 my-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-emerald-400 ring-2 ring-emerald-500/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-emerald-400">Great Instinct! Call Declined.</h3>
                <p className="text-xs text-slate-300 leading-relaxed px-4">
                  In real life, declining unknown suspicious calls is your first line of defense.
                </p>
                <p className="text-[11px] text-amber-300 font-semibold pt-2">
                  For training purposes, accept the call to hear the scammer&apos;s tactics and test your decision making!
                </p>
              </div>

              <button
                onClick={startCall}
                className="inline-flex items-center gap-2 rounded-none bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-try Call Drill
              </button>
            </div>
          )}

          {/* STATE 4 & 5: CONNECTED OR RESOLVED */}
          {(callState === "CONNECTED" || callState === "RESOLVED") && (
            <div className="space-y-4 py-2 my-auto">
              {/* LIVE CALL HEADER BAR */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${callState === "CONNECTED" ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
                  <span className="text-xs font-mono font-bold text-red-400">
                    {callState === "CONNECTED" ? "LIVE CALL CONNECTED" : "CALL ENDED"}
                  </span>
                </div>
                {/* REAL-TIME TICKING TIMER */}
                <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-emerald-400 font-bold">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatTimer(secondsElapsed)}</span>
                </div>
              </div>

              {/* CALLER INFO */}
              <div className="flex items-center justify-between bg-slate-900/90 p-3 border border-slate-800">
                <div>
                  <p className="text-xs font-black text-white">{scenario.callerName}</p>
                  <p className="text-[10px] font-mono text-slate-400">{scenario.callerNumber}</p>
                </div>
                {getUrgencyBadge(scenario.urgencyLevel)}
              </div>

              {/* AUDIO WAVEFORM ANIMATION */}
              <div className="bg-slate-900 border border-slate-800 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <Mic className="h-3.5 w-3.5 text-red-400 animate-pulse" />
                  <span>{isTyping ? "Caller Speaking..." : "Caller Paused"}</span>
                </div>

                {/* CSS FREQUENCY WAVEFORM BARS */}
                <div className="flex items-center gap-1 h-5">
                  {[40, 80, 50, 90, 30, 70, 100, 60, 40, 85, 45].map((height, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isTyping ? "bg-red-500 animate-pulse" : "bg-slate-700"
                      }`}
                      style={{
                        height: isTyping ? `${Math.max(20, (height * (i % 3 + 1)) % 100)}%` : "20%",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* TYPEWRITER AUDIO TRANSCRIPT BOX */}
              <div className="rounded-none border border-slate-800 bg-slate-900/90 p-4 space-y-2 max-h-48 overflow-y-auto">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5 text-red-400" /> Incoming Live Audio Transcript
                  </span>
                  {isTyping && <span className="text-red-400 animate-pulse text-[9px] font-mono">REC ●</span>}
                </p>
                <p className="text-xs font-semibold text-slate-200 leading-relaxed italic font-sans">
                  &ldquo;{displayedTranscript}&rdquo;
                  {isTyping && <span className="inline-block w-1.5 h-3 bg-red-500 ml-1 animate-ping" />}
                </p>
              </div>
            </div>
          )}

          {/* BOTTOM FOOTER */}
          <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 text-center flex items-center justify-between">
            <span>FinTell Anti-Fraud Simulator</span>
            <span>Scenario {activeScenarioIndex + 1} of {CALL_SCENARIOS.length}</span>
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE DECISION & RED FLAGS PANEL (7 COLS) */}
        <div className="lg:col-span-7 rounded-none border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
          
          <div>
            {/* PANEL TITLE */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Security Decision &amp; Analysis</span>
              </h3>
              <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5">
                Threat Score: <strong className="text-red-600">{scenario.threatScore}/100</strong>
              </span>
            </div>

            {/* PRE-CALL STATE */}
            {callState !== "CONNECTED" && callState !== "RESOLVED" ? (
              <div className="py-16 text-center space-y-3 text-slate-400">
                <ShieldAlert className="mx-auto h-12 w-12 text-slate-300" />
                <h4 className="text-sm font-black text-slate-700">Call Drill Inactive</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click <strong>&quot;Simulate Incoming Scam Call&quot;</strong> on the phone screen to start the live drill and test your response under pressure.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-3">
                
                {/* DYNAMIC RED FLAGS DETECTED CARD */}
                <div className="rounded-none border border-amber-200 bg-amber-50/70 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
                      Live Scam Red Flags Detected ({revealedFlagsCount}/{scenario.redFlags.length})
                    </p>
                    <span className="text-[9px] font-mono font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.5">
                      REAL-TIME ANALYSIS
                    </span>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {scenario.redFlags.slice(0, revealedFlagsCount).map((flag, fIdx) => (
                      <li key={fIdx} className="text-xs font-semibold text-amber-950 flex items-start gap-2 animate-fade-in">
                        <span className="text-red-600 font-bold shrink-0">⚠️</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* RESPONSE OPTIONS */}
                <div className="space-y-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-700">
                    What is your immediate response to this call?
                  </p>

                  <div className="space-y-2">
                    {scenario.options.map((opt, idx) => {
                      const isResolved = callState === "RESOLVED";

                      return (
                        <button
                          key={idx}
                          disabled={isResolved}
                          onClick={() => handleChoice(idx)}
                          className={`w-full text-left rounded-none border p-3.5 transition cursor-pointer space-y-1 ${
                            selectedOption === idx
                              ? opt.isSafe
                                ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600"
                                : "border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-900"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-none font-black text-xs ${
                                  selectedOption === idx
                                    ? opt.isSafe
                                      ? "bg-emerald-600 text-white"
                                      : "bg-red-600 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <p className="text-xs font-extrabold leading-tight">{opt.text}</p>
                            </div>

                            {selectedOption === idx && (
                              <span className="shrink-0">
                                {opt.isSafe ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ENHANCED RESOLUTION FEEDBACK CARD */}
          {selectedOption !== null && (
            <div className="rounded-none border border-slate-900 bg-slate-900 p-5 text-white space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span
                  className={`rounded-none px-3 py-1 text-xs font-black uppercase ${
                    scenario.options[selectedOption].isSafe
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {scenario.options[selectedOption].isSafe ? "SAFE SECURITY CHOICE" : "HIGH RISK FRAUD TRAP"}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  Call Time: {formatTimer(secondsElapsed)}
                </span>
              </div>

              {/* EXPLANATION */}
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {scenario.options[selectedOption].explanation}
              </p>

              {/* WHAT SCAMMER WANTED & REAL WORLD ACTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800 text-xs">
                <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
                  <p className="text-[10px] font-black uppercase text-red-400">What Scammer Wanted:</p>
                  <p className="text-slate-300 text-[11px] leading-snug">{scenario.scammerGoal}</p>
                </div>

                <div className="bg-slate-950 p-3 border border-slate-800 space-y-1">
                  <p className="text-[10px] font-black uppercase text-emerald-400">Real-World Action:</p>
                  <p className="text-slate-300 text-[11px] leading-snug">{scenario.realWorldAction}</p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2 flex items-center justify-between">
                <p className="text-[11px] text-slate-400 font-bold">
                  Completed Drill {activeScenarioIndex + 1} of {CALL_SCENARIOS.length}
                </p>
                <button
                  onClick={nextScenario}
                  className="inline-flex items-center gap-2 rounded-none bg-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition cursor-pointer shadow-md"
                >
                  Next Scam Drill &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
