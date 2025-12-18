"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";

// --- DATA ---
const PARTNER_PROFILES = {
    "Denise Okoro": {
        name: "Denise Okoro",
        imagePath: "/Denise Okoro.webp",
        description:
            "Firm, supportive, and pragmatic, Denise Okoro helps you cut through the noise and focus on what matters. With a grounded, big-sister energy, she keeps you centered and moving forward.",
        useCases: [
            "Overwhelmed and need clear priorities",
            "Stuck and struggling to make progress",
            "Mentally scattered and craving steadiness",
            'In a "just tell me what matters" mindset',
        ],
        lastConnectedDate: "November 28, 2025",
    },
} as const;

export default function SelectedTPProfilePage() {
    const router = useRouter();
    const partner = PARTNER_PROFILES["Denise Okoro"];

    return (
        <main className="light-bg-page partner-match-beige">
            <SiteMenu burgerColor="#2f2b25" />

            <Image
                src="/Logo Dark.png"
                alt="App Logo"
                width={56}
                height={56}
                priority
                className="up-logo-top-right"
            />

            <div className="match-beige-shell">
                <header className="match-beige-header">
                    <h1 className="match-beige-title">Here&apos;s who I&apos;ve matched you with for this session.</h1>
                    <p className="match-beige-subtitle">
                        Based on what you shared, this Thought Partner is a strong fit for what you need right now.
                    </p>
                </header>

                <section className="match-beige-bio-section">
                    <div className="match-history-divider" />

                    {/* New Row Container for Image and Name */}
                    <div className="match-partner-header-row">
                        <div className="match-avatar-wrapper">
                            <Image
                                src={partner.imagePath}
                                alt={partner.name}
                                width={80}
                                height={80}
                                className="match-avatar-img"
                            />
                        </div>
                        <h2 className="match-partner-name">{partner.name}</h2>
                    </div>

                    <p className="match-partner-bio">{partner.description}</p>
                </section>

                <section className="match-beige-use-cases">
                    <h3 className="match-use-case-title">Best to use when you&apos;re...</h3>
                    <ul className="match-use-case-list">
                        {partner.useCases.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </section>

                <footer className="match-beige-history">
                    <div className="match-history-divider" />
                    <span className="match-history-label">Previously Connected</span>
                    <span className="match-history-date">Last Conversation: {partner.lastConnectedDate}</span>
                </footer>

                <div className="match-beige-actions">
                    <button
                        className="match-beige-call-btn-v2"
                        onClick={() => router.push("/dialing")}
                    >
                        <div className="match-call-icon-circle-v2">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="match-call-icon-v2">
                                <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 003.7.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.7 1 1 0 01-.27 1.11l-2.2 2.2z" />
                            </svg>
                        </div>
                        Make the Call
                    </button>

                    <button
                        className="match-beige-new-link-v2"
                        onClick={() => router.back()}
                    >
                        <span className="arrow-left">←</span> New Match
                    </button>
                </div>
            </div>
        </main>
    );
}