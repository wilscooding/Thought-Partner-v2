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
  const [gender, setGender] = useState<string | null>(null);

  const handleContinue = () => {
    if (!gender) return;
    // TODO: save gender
    router.push("/up/name");
  };

  return (
    <main className="light-bg-page">
      <div className="intro-shell">
        <h1 className="intro-title">
          Choose the gender<br />
          identity that fits you.
        </h1>

        <div className="up-options">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={
                "up-pill-option " +
                (gender === option ? "up-pill-option--selected" : "")
              }
              onClick={() => setGender(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          className="intro-btn"
          disabled={!gender}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
