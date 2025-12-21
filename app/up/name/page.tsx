"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UpNamePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Validation now requires both first and last name to be entered
  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleNext = () => {
    if (!canContinue) return;
    // Next page in sequence: Age Page
    router.push("/up/age");
  };

  return (
    <main className="up-light-bg-page">
      {/* top-right logo */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="intro-shell">
        <h1 className="intro-title">What should we call you?</h1>

        <div className="up-select-wrapper">

          {/* ===== First Name Block (Label + Input) ===== */}
          <div className="up-input-block">
            <label className="up-input-label" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              className="up-select-pill"
              type="text"
              placeholder=""
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* ===== Last Name Block (Label + Input) ===== */}
          <div className="up-input-block">
            <label className="up-input-label" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              className="up-select-pill"
              type="text"
              placeholder=""
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

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