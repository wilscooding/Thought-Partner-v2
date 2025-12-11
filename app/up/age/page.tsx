"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AGE_OPTIONS = ["18–24", "25–34", "35–44", "45–54", "55+"];

export default function UpAgePage() {
  const router = useRouter();
  const [ageRange, setAgeRange] = useState("");

  const handleNext = () => {
    if (!ageRange) return;
    router.push("/up/experience");
  };

  return (
    <main className="light-bg-page">
      {/* logo top-right */}
      <img src="/Logo Gold.png" alt="App Logo" className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">
          What age range are<br />
          you in?
        </h1>

        {/* dropdown pill */}
        <div className="up-select-wrapper">
          <select
            className="up-select"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          >
            <option value="" disabled>
              Select your age range
            </option>
            {AGE_OPTIONS.map((opt) => (
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
            {/* tail */}
            <line x1="18" y1="12" x2="6" y2="12" />
            {/* head */}
            <polyline points="10 8 6 12 10 16" />
          </svg>
        </button>

        {/* NEXT: ----> */}
        <button
          type="button"
          className="up-nav-btn"
          disabled={!ageRange}
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
            {/* tail */}
            <line x1="6" y1="12" x2="18" y2="12" />
            {/* head */}
            <polyline points="14 8 18 12 14 16" />
          </svg>
        </button>
      </div>
    </main>
  );
}
