"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–3 years",
  "4–7 years",
  "8–15 years",
  "15+ years",
];

export default function UpExperiencePage() {
  const router = useRouter();
  const [years, setYears] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleNext = () => {
    if (!years) return;
    // Next page in sequence: Thinking Style
    router.push("/up/thinking-style");
  };

  const handleOptionSelect = (opt: string) => {
    setYears(opt);
    setIsOptionsOpen(false);
  };

  return (
    <main className="up-light-bg-page">
      {/* logo top-right */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          Roughly how many years have you<br />
          been in your field?
        </h1>

        {/* DROPDOWN PILL: CUSTOM IMPLEMENTATION */}
        <div className="up-select-wrapper">
          {/* 1. The Pill (now a clickable button) */}
          <button
            className="up-select-pill"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            {years || "Select your experience"}
          </button>

          {/* 2. The custom SVG arrow */}
          <svg
            className="up-select-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>

          {/* 3. The Options List */}
          {isOptionsOpen && (
            <div className="up-options-list">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`up-option-item ${years === opt ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* bottom nav arrows */}
      <div className="up-bottom-nav">
        {/* BACK: <──── */}
        <button
          type="button"
          className="up-nav-btn"
          onClick={() => router.back()}
        >
          <svg
            className="up-arrow-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="24" y1="12" x2="6" y2="12" />
            <polyline points="10 8 6 12 10 16" />
          </svg>
        </button>

        {/* NEXT: ────> */}
        <button
          type="button"
          className="up-nav-btn"
          disabled={!years}
          onClick={handleNext}
        >
          <svg
            className="up-arrow-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="0" y1="12" x2="18" y2="12" />
            <polyline points="14 8 18 12 14 16" />
          </svg>
        </button>
      </div>
    </main>
  );
}