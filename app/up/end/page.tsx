"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateAccountEndPage() {
  const router = useRouter();

  return (
    <main className="light-bg-page">
      {/* top-right logo removed as per request */}

      <div className="intro-shell">
        {/* Large, centered gold logo from PDF */}
        <div className="mb-10 up-logo-center-wrapper">
          {/* Use a class here to manage the centering and size via CSS */}
          <Image
            src="/Logo Gold.png"
            alt="App Logo"
            width={120}
            height={120}
            priority={true}
            // The size and margin should ideally be handled by the up-logo-center-wrapper class or global styles
            // For now, removing inline styles that were based on previous assumption:
            // style={{ width: 120, height: 120, margin: '0 auto' }} 
            className="login-main-logo"
          />
        </div>

        {/* Title from Create Account End.pdf */}
        <h1 className="intro-title">
          Your Thinking Space
          <br />
          Is Ready!
        </h1>

        {/* First paragraph */}
        <p className="intro-subtitle">
          You&apos;ve set your foundation. Now your Thought Partners are here whenever you need support.
        </p>

        {/* Second paragraph */}
        <p className="intro-subtitle">
          They&apos;re built for depth, clarity, and reflection. Speak to them the same way you would a trusted collaborator.
        </p>

        {/* Third paragraph */}
        <p className="intro-subtitle-small">
          Ask. explore, pause. rethink. Built for thinking. Not isolation.
        </p>

        {/* Enter Your Space button */}
        <button
          className="intro-btn"
          onClick={() => router.replace("/home")} // Use replace to prevent going back to onboarding
        >
          Enter Your Space
        </button>
      </div>
    </main>
  );
}