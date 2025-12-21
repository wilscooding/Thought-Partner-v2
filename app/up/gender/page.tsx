"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GENDER_OPTIONS = [
  "Woman",
  "Man",
  "Non-Binary",
  "Prefer not to say",
];

export default function UpGenderPage() {
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleNext = () => {
    if (!gender) return;
    // Next page in sequence: Proof of Identity
    router.push("/up/proof-of-identity");
  };

  const handleOptionSelect = (opt: string) => {
    setGender(opt);
    setIsOptionsOpen(false);
  };

  return (
    <main className="up-light-bg-page">
      {/* logo top-right */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          Choose the gender<br />
          identity that fits you.
        </h1>

        {/* DROPDOWN PILL: CUSTOM IMPLEMENTATION */}
        <div className="up-select-wrapper">
          {/* 1. The Pill (now a clickable button) */}
          <button
            className="up-select-pill"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            {gender || "Select your gender identity"}
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
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`up-option-item ${gender === opt ? 'selected' : ''}`}
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
          disabled={!gender}
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