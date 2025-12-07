"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpNamePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleContinue = () => {
    if (!firstName.trim()) return;
    // TODO: save firstName + lastName
    router.push("/up/thinking-style");
  };

  const canContinue = firstName.trim().length > 0;

  return (
    <main className="light-bg-page">
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

        <button
          className="intro-btn"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
