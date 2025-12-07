"use client";

import { useRouter } from "next/navigation";

export default function CreateAccountIntro() {
  const router = useRouter();

  return (
    <main className="light-bg-page">
      <div className="intro-shell">
        {/* Title from the PDF */}
        <h1 className="intro-title">
          Let&apos;s Set Up Your
          <br />
          Thinking Space
        </h1>

        {/* First paragraph */}
        <p className="intro-subtitle">
          Before you dive in, we&apos;ll walk you through a few short questions
          to shape how you use the app.
        </p>

        {/* Second line: "Nothing complex—just the basics." */}
        <p className="intro-subtitle-small">
          Nothing complex—just the basics.
        </p>

        {/* Get Started button -> goes to main Create Account page */}
        <button
          className="intro-btn"
          onClick={() => router.push("/auth/register")}
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
