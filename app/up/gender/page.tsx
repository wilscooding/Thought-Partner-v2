"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GENDER_OPTIONS = [
  "Woman",
  "Man",
  "Non-binary",
  "Prefer not to say",
  "Self-describe",
];

export default function UpGenderPage() {
  const router = useRouter();
  const [gender, setGender] = useState("");

  const handleNext = () => {
    if (!gender) return;
    router.push("/up/name");
  };

  return (
    <main className="light-bg-page up-page">
      {/* logo top-right */}
      <img src="/Logo Gold.png" alt="App Logo" className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          Choose the gender<br />
          identity that fits you.
        </h1>

        {/* dropdown pill */}
        <div className="up-select-wrapper">
          <select
            className="up-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>
              Select your gender identity
            </option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
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
          onClick={() => router.push("/up/experience")}
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
          disabled={!gender}
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
