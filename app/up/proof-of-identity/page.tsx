"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const IDENTITY_OPTIONS = [
  "Career Changer/Explorer",
  "Entrepreneur/Founder",
  "Independent Consultant/Coach",
  "Individual Contributor (non-manager)",
  "Nonprofit or Mission-Driven Professional",
  "People Manager/Team Lead",
  "Senior Leader/Executive",
  "Side Hustler/Aspiring Founder",
  "Student/Early Career Professional",
];

export default function UpProfessionalIdentityPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleNext = () => {
    if (!identity) return;
    // Next page in sequence: Industry
    router.push("/up/industry");
  };

  const handleOptionSelect = (opt: string) => {
    setIdentity(opt);
    setIsOptionsOpen(false);
  };

  return (
    <main className="up-light-bg-page">
      {/* logo top-right */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          What professional identity<br />
          feels most like you?
        </h1>

        {/* DROPDOWN PILL: CUSTOM IMPLEMENTATION */}
        <div className="up-select-wrapper">
          {/* 1. The Pill (now a clickable button) */}
          <button
            className="up-select-pill"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            {identity || "Select your professional identity"}
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
              {IDENTITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`up-option-item ${identity === opt ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* bottom arrows */}
      <div className="up-bottom-nav">
        {/* BACK: <---- */}
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

        {/* NEXT: ----> */}
        <button
          type="button"
          className="up-nav-btn"
          disabled={!identity}
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