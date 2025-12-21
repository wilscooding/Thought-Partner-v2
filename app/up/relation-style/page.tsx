"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const relationOptions = [
  "Empathetic",
  "Supportive",
  "Thoughtful",
  "Challenging",
  "Practical",
];

export default function UpRelationStylePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false); // Custom dropdown state

  const canContinue = selectedStyle !== "";

  const handleNext = () => {
    if (!canContinue) return;
    // Next page in sequence: Create Account End Page
    router.push("/up/end");
  };

  const handleOptionSelect = (style: string) => {
    setSelectedStyle(style);
    setIsOptionsOpen(false); // Close the list after selection
  };

  return (
    <main className="up-light-bg-page">
      {/* top-right logo */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          Choose the word that
          <br />
          best fits your
          <br />
          relational style.
        </h1>

        {/* DROPDOWN PILL: CUSTOM IMPLEMENTATION (matching Age page) */}
        <div className="up-select-wrapper">
          {/* 1. The Pill (now a clickable button) */}
          <button
            className="up-select-pill"
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          >
            {selectedStyle || "Select your relational style"}
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

          {/* 3. The Options List (The element we can now style perfectly) */}
          {isOptionsOpen && (
            <div className="up-options-list">
              {relationOptions.map((style) => (
                <button
                  key={style}
                  // Using 'up-option-item' class
                  className={`up-option-item ${selectedStyle === style ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(style)}
                >
                  {style}
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
          disabled={!canContinue}
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