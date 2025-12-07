"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AGE_OPTIONS = [
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55+",
];

export default function UpAgePage() {
  const router = useRouter();
  const [ageRange, setAgeRange] = useState<string | null>(null);

  const handleContinue = () => {
    if (!ageRange) return;
    // TODO: save ageRange to your store / API
    router.push("/up/experience");
  };

  return (
    <main className="light-bg-page">
      <div className="intro-shell">
        <h1 className="intro-title">What age range are you in?</h1>
        <div className="up-options">
          {AGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={
                "up-pill-option " +
                (ageRange === option ? "up-pill-option--selected" : "")
              }
              onClick={() => setAgeRange(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="intro-btn"
          disabled={!ageRange}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
