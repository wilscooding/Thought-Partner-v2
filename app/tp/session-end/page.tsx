"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";

// Gold Home Icon SVG [cite: 3, 6]
const HomeIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="end-home-icon"
    >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
);

export default function TPSessionEndPage() {
    const router = useRouter();

    return (
        <main className="dark-landing-page end-session-page">
            {/* Burger menu (top-left) */}
            <SiteMenu />

            {/* Logo top-right */}
            <Image
                src="/Logo Gold.png"
                alt="App Logo"
                width={56}
                height={56}
                priority={true}
                className="main-logo-top-right"
            />

            <div className="end-session-shell">
                <div className="end-session-header">
                    <h1 className="end-status">Call Ended</h1> {/* [cite: 3] */}
                </div>

                <div className="end-session-message">
                    <p className="end-breath-note">
                        Session complete. Take a moment to breathe. {/* [cite: 4] */}
                    </p>
                    <p className="end-continue-note">
                        If anything stands out or you'd like to continue exploring,
                        I'm here when you're ready. {/* [cite: 5] */}
                    </p>
                </div>

                {/* Large Home Button  */}
                <button
                    className="end-home-btn"
                    onClick={() => router.push("/home")}
                    aria-label="Return to Home"
                >
                    <HomeIcon />
                    <span className="end-home-text">Home</span> {/*  */}
                </button>
            </div>
        </main>
    );
}