"use client";

import SiteMenu from "@/components/SiteMenu";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- ICON COMPONENTS ---

// Phone Icon SVG for the "Make the Call" button
const PhoneIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="session-end-phone-icon"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.71-4.71 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.74A14.28 14.28 0 0 0 9.87 7.7a2 2 0 0 1-.33 2.13l-1.9 1.9a15.4 15.4 0 0 0 6.55 6.55l1.9-1.9a2 2 0 0 1 2.13-.33 14.28 14.28 0 0 0 3.96 1.63 2 2 0 0 1 1.74 2z" />
    </svg>
);


export default function SessionSetupEndPage() {
    const router = useRouter();

    const handleCallClick = () => {
        // Placeholder: Start the call/session flow
        console.log("Initiating call...");
        // router.push('/session/call'); 
    };

    const handleStartOverClick = () => {
        // Placeholder: Go back to the session start page
        router.push('/session/start');
    };

    return (
        <main className="light-bg-page">

            {/* Top-left menu button */}
            <SiteMenu burgerColor="#2f2b25" />

            {/* Top-right logo using Logo Dark.png */}
            <Image
                src="/Logo Dark.png"
                alt="Thought Partner Logo"
                width={56}
                height={56}
                priority
                className="main-logo-top-right"
            />

            {/* Main content shell, centered and constrained */}
            <div className="session-end-shell">

                {/* Title: All set. I've passed everything along. [cite: 17] */}
                <h1 className="session-end-title">
                    All set. I&apos;ve passed
                    <br />
                    everything along.
                </h1>

                {/* Subtitle/Description: Your Thought Partner has what they need to begin. [cite: 18] */}
                <p className="session-end-subtitle">
                    Your Thought Partner has what they need to begin. [cite: 18]
                </p>

                {/* Primary CTA: Make the Call [cite: 19] */}
                <button
                    className="session-end-call-btn"
                    onClick={handleCallClick}
                >
                    <PhoneIcon />
                    Make the Call [cite: 19]
                </button>

                {/* Secondary CTA: Start Over [cite: 20] */}
                <button
                    className="session-end-secondary-btn"
                    onClick={handleStartOverClick}
                >
                    Start Over [cite: 20]
                </button>
            </div>
        </main>
    );
}