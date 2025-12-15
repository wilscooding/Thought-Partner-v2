"use client";

import SiteMenu from "@/components/SiteMenu";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SessionSetupStartPage() {
  const router = useRouter();

  const handleBeginClick = () => {
    // Navigate to the first session setup question
    router.push("/session/q1");
  };

  const handleBrowseProfilesClick = () => {
    // Navigate back to the full partner list
    router.push("/partners");
  };

  return (
    <main className="light-bg-page">
      {/* Top-right logo using Logo Dark.png */}
      <SiteMenu  burgerColor="#2f2b25" />
      <Image
        src="/Logo Dark.png"
        alt="Thought Partner Logo"
        width={56}
        height={56}
        priority
        className="main-logo-top-right"
      />

      {/* Main content shell, centered and constrained */}
      <div className="session-setup-shell">
        {/* Title */}
        <h1 className="session-setup-title">
          Let me get things set up
          <br />
          for your session.
        </h1>

        {/* Subtitle / description */}
        <p className="session-setup-subtitle">
          Just a few quick questions so I can pass along what you’re hoping to
          cover today.
        </p>

        {/* Primary button: Begin */}
        <button
          className="session-setup-primary-btn"
          onClick={handleBeginClick}
        >
          Begin
        </button>

        {/* Secondary button: Browse Profiles */}
        <button
          className="session-setup-secondary-btn"
          onClick={handleBrowseProfilesClick}
        >
          Browse Profiles
        </button>
      </div>
    </main>
  );
}
