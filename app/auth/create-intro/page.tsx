"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateAccountIntro() {
  const router = useRouter();

  return (
    <main className="light-bg-page">
      {/* ===== TOP-RIGHT LOGO ADDED ===== */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="intro-shell">
        {/* Title from the PDF [: 22] */}
        <h1 className="intro-title">
          Let&apos;s Set Up Your
          <br />
          Thinking Space
        </h1>

        {/* First paragraph [: 23] */}
        <p className="intro-subtitle">
          Before you dive in, we&apos;ll walk you through a few short questions
          to shape how you use the app.
        </p>

        {/* Second line: "Nothing complex—just the basics." [: 24] */}
        <p className="intro-subtitle-small">
          Nothing complex—just the basics.
        </p>

        {/* Get Started button [: 25] -> goes to main Create Account page */}
        <button
          className="intro-btn"
          onClick={() => router.push("/up/name")}
        >
          Get Started
        </button>
      </div>
    </main>
  );
}