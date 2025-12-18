"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";

export default function SessionSetupPage() {
    const router = useRouter();

    const questions = [
        { id: 1, label: "What do you want to think through today?", placeholder: "Select an option..." },
        { id: 2, label: "Which area best fits today's topic?", placeholder: "Select an area..." },
        { id: 3, label: "How are you feeling right now?", placeholder: "Select your mood..." },
        { id: 4, label: "What do you want to walk away after todays session?", placeholder: "Select an outcome..." }
    ];

    return (
        <main className="light-bg-page session-setup-page">
            <SiteMenu burgerColor="#2f2b25" />

            <Image
                src="/Logo Dark.png"
                alt="App Logo"
                width={56}
                height={56}
                priority
                className="main-logo-top-right"
            />

            <div className="setup-shell">
                <form className="setup-form">
                    {questions.map((q) => (
                        <div key={q.id} className="setup-field">
                            <label className="setup-label">{q.label}</label>
                            <div className="up-select-pill">
                                <span className="pill-placeholder">{q.placeholder}</span>
                                {/* 2. The custom SVG arrow (replacing the span) */}
                                <svg
                                    className="up-select-arrow"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {/* Downward arrow icon (you can customize this SVG) */}
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="setup-submit-btn"
                        onClick={() => router.push("/match-loading")}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </main>
    );
}