"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const THINKING_OPTIONS = [
  "Big-picture",
  "Detail-oriented",
  "Strategic",
  "Creative",
  "Analytical",
];

export default function UpThinkingStylePage() {
  const router = useRouter();
  const [style, setStyle] = useState<string | null>(null);

  const handleContinue = () => {
    if (!style) return;
    // TODO: save thinking style
    // After this, you can route to the main app or the next onboarding step
    router.push("/home");
  };

  return (
    <main className="light-bg-page">
      <div className="intro-shell">
        <h1 className="intro-title">
          Choose the word that<br />
          best fits your thinking style.
        </h1>

        <div className="up-options">
          {THINKING_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={
                "up-pill-option " +
                (style === option ? "up-pill-option--selected" : "")
              }
              onClick={() => setStyle(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          className="intro-btn"
          disabled={!style}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
