"use client";

import React from "react";

// 1. Premium Security Hero Illustration (Alternates between both WebP images smoothly with zero layout shift)
export function ScamHeroIllustration({ className = "w-full h-[220px] sm:h-[260px] lg:h-[280px]" }: { className?: string }) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  const images = React.useMemo(
    () => ["/scam-safety-2.webp?v=10", "/scam-safety.webp?v=10"],
    []
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Scam & Fraud Defense Illustration ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
            index === activeIdx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        />
      ))}
    </div>
  );
}

// 2. SMS / WhatsApp Message Channel SVG Icon
export function SmsChannelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="4" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.8" />
      <path d="M7 9H17" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 13H13" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="13" r="2" fill="#ef4444" />
    </svg>
  );
}

// 3. Phishing Email Channel SVG Icon
export function EmailChannelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
      <path d="M2 7L12 13L22 7" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="15" r="2.5" fill="#ef4444" />
    </svg>
  );
}

// 4. Phone Call / Voice Fraud SVG Icon
export function CallChannelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 16.92V19.92C22 20.48 21.54 20.94 20.98 20.94C9.4 20.94 0.0600586 11.6 0.0600586 0.0200195C0.0600586 -0.53998 0.520059 -1 1.08006 -1H4.08006C4.58006 -1 5.01006 -0.63002 5.07006 -0.13002C5.25006 1.34998 5.62006 2.77998 6.16006 4.12998C6.30006 4.47998 6.21006 4.87998 5.93006 5.14998L4.47006 6.60998C6.31006 10.15 9.17006 13.01 12.71 14.85L14.17 13.39C14.44 13.11 14.84 13.02 15.19 13.16C16.54 13.7 17.97 14.07 19.45 14.25C19.96 14.32 20.33 14.75 20.33 15.25V16.92H22Z"
        transform="translate(1 1)"
        fill="#fee2e2"
        stroke="#dc2626"
        strokeWidth="1.8"
      />
    </svg>
  );
}

// 5. UPI / Payment Gateway Channel SVG Icon
export function UpiChannelIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="1.8" />
      <path d="M7 12H17" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7V17" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="7" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

export function InvestTutorialIllustration({ className = "w-full h-[220px] sm:h-[260px] lg:h-[280px] object-contain" }: { className?: string }) {
  return (
    <img
      src="/investment-safety.webp"
      alt="Investment Safety Tutorial Illustration"
      className={className}
    />
  );
}

