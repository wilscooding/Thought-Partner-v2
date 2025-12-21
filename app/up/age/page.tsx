"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AGE_OPTIONS = ["18–24", "25–34", "35–44", "45–54", "55+"];

export default function UpAgePage() {
    const router = useRouter();
    const [ageRange, setAgeRange] = useState("");
    // NEW STATE: To control the visibility of the custom dropdown options
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    const handleNext = () => {
        if (!ageRange) return;
        router.push("/up/gender");
    };

    const handleOptionSelect = (opt: string) => {
        setAgeRange(opt);
        setIsOptionsOpen(false); // Close the list after selection
    };

    return (
        <main className="up-light-bg-page">
            {/* logo top-right */}
            <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

            <div className="intro-shell">
                <h1 className="intro-title">
                    What age range are<br />
                    you in?
                </h1>

                {/* DROPDOWN PILL: CUSTOM IMPLEMENTATION */}
                <div className="up-select-wrapper">
                    {/* 1. The Pill (now a clickable button) */}
                    <button
                        className="up-select-pill"
                        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                    >
                        {ageRange || "Select your age range"}
                    </button>

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

                    {/* 3. The Options List (The element we can now style perfectly) */}
                    {isOptionsOpen && (
                        <div className="up-options-list">
                            {AGE_OPTIONS.map((opt) => (
                                <button
                                    key={opt}
                                    className={`up-option-item ${ageRange === opt ? 'selected' : ''}`}
                                    onClick={() => handleOptionSelect(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* bottom arrows (using corrected viewBox coordinates) */}
            <div className="up-bottom-nav">
                {/* BACK: <---- (x1 set to 24 for max visible tail) */}
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
                        {/* tail */}
                        <line x1="24" y1="12" x2="6" y2="12" />
                        {/* head */}
                        <polyline points="10 8 6 12 10 16" />
                    </svg>
                </button>

                {/* NEXT: ----> (x1 set to 0 for max visible tail) */}
                <button
                    type="button"
                    className="up-nav-btn"
                    disabled={!ageRange}
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
                        {/* tail */}
                        <line x1="0" y1="12" x2="18" y2="12" />
                        {/* head */}
                        <polyline points="14 8 18 12 14 16" />
                    </svg>
                </button>
            </div>
        </main>
    );
}