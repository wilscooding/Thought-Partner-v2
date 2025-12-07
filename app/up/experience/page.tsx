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
  const [years, setYears] = useState<string | null>(null);

  const handleContinue = () => {
    if (!years) return;
    // TODO: save years
    router.push("/up/gender");
  };

  return (
    <main className="light-bg-page">
      <div className="intro-shell">
        <h1 className="intro-title">
          Roughly how many years have you<br />
          been in your field?
        </h1>

        <div className="up-options">
          {EXPERIENCE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={
                "up-pill-option " +
                (years === option ? "up-pill-option--selected" : "")
              }
              onClick={() => setYears(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          className="intro-btn"
          disabled={!years}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
