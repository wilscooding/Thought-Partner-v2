"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpNamePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const canContinue = firstName.trim().length > 0;

  const handleNext = () => {
    if (!canContinue) return;
    // TODO: save names
    router.push("/up/thinking-style");
  };

  return (
    <main className="light-bg-page up-page">
      {/* top-right logo */}
      <img src="/Logo Gold.png" alt="App Logo" className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">What should we call you?</h1>

        <input
          className="auth-input"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          className="auth-input"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* bottom nav arrows */}
      <div className="up-bottom-nav">
        {/* BACK <──── */}
        <button
          type="button"
          className="up-nav-btn"
          onClick={() => router.push("/up/gender")}
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
            <line x1="34" y1="12" x2="6" y2="12" />
            <polyline points="12 8 6 12 12 16" />
          </svg>
        </button>

        {/* NEXT ────> */}
        <button
          type="button"
          className="up-nav-btn"
          disabled={!canContinue}
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
            <line x1="6" y1="12" x2="34" y2="12" />
            <polyline points="28 8 34 12 28 16" />
          </svg>
        </button>
      </div>
    </main>
  );
}
