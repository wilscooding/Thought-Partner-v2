"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXPERIENCE_OPTIONS = [
  "0–1 years",
  "2–4 years",
  "5–9 years",
  "10–19 years",
  "20+ years",
];

export default function UpExperiencePage() {
  const router = useRouter();
  const [years, setYears] = useState("");

  const handleNext = () => {
    if (!years) return;
    // TODO: save years
    router.push("/up/gender");
  };

  return (
    <main className="light-bg-page up-page">
      {/* logo top-right */}
      <img src="/Logo Gold.png" alt="App Logo" className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          Roughly how many years have you<br />
          been in your field?
        </h1>

        {/* dropdown pill */}
        <div className="up-select-wrapper">
          <select
            className="up-select"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          >
            <option value="" disabled>
              Select your experience
            </option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <span className="up-select-arrow">⌄</span>
        </div>
      </div>

      {/* bottom arrows */}
      <div className="up-bottom-nav">
        {/* BACK: <──── */}
        <button
          type="button"
          className="up-nav-btn"
          onClick={() => router.push("/up/age")}
        >
          <svg
            className="up-arrow-icon"
            viewBox="0 0 40 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* long tail */}
            <line x1="34" y1="12" x2="6" y2="12" />
            {/* head */}
            <polyline points="12 8 6 12 12 16" />
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
            viewBox="0 0 40 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* long tail */}
            <line x1="6" y1="12" x2="34" y2="12" />
            {/* head */}
            <polyline points="28 8 34 12 28 16" />
          </svg>
        </button>
      </div>
    </main>
  );
}
