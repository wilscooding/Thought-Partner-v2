"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Corrected import path as requested
import SiteMenu from '@/components/SiteMenu';
import Image from "next/image";

// --- DATA: List of Thought Partners ---
// The first 6 match the names and order from the visual mock-up.
const PARTNERS = [
    { name: "Casey Morgan", imagePath: "/Denise Okoro.webp" }, // Matches Image 1 in PDF
    { name: "Alex Rowan", imagePath: "/Alex Rowan.webp" }, // Matches Image 2 in PDF
    { name: "Emery Jules", imagePath: "/Emery Jules.webp" }, // Matches Image 3 in PDF
    { name: "Nadine Shah", imagePath: "/Nadine Shah.webp" }, // Matches Image 4 in PDF
    { name: "Julian Park", imagePath: "/Leo Tran.webp" }, // Matches Image 5 in PDF
    { name: "Morgan Vale", imagePath: "/Elliott Stein.webp" }, // Matches Image 6 in PDF
    // Remaining profiles to enable the scroll feature:
    { name: "Ellis Reed", imagePath: "/Ellis Reed.webp" },
    { name: "Rosa Alvarez", imagePath: "/Rosa Alvarez.webp" },
    { name: "Theo Lane", imagePath: "/Theo Lane.webp" },
    { name: "River Quinn", imagePath: "/River Quinn.webp" },
    { name: "Rami Ellis", imagePath: "/Rami Ellis.webp" },
    { name: "Jordan Lane", imagePath: "/Jordan Lane.webp" },
];

export default function TPProfileLandingPage() {
    const router = useRouter();

    const handleProfileClick = (name: string) => {
        // Placeholder for navigation to a specific partner's page
        router.push(`/partner/${name.replace(/\s+/g, '-').toLowerCase()}`);
    };

    const handleMatchMeClick = () => {
        // Placeholder for navigation to the Matching flow
        router.push('/match-flow/start');
    };

    return (
        // Uses the dark background class defined in your CSS
        <main className="dark-landing-page">

            <SiteMenu />

            <Image
                src="/Logo Gold.png"
                alt="App Logo"
                width={56}
                height={56}
                priority={true}
                className="main-logo-top-right"
            />

            {/* Main content shell, centered and constrained */}
            <div className="tp-profile-shell">

                <h1 className="tp-profile-title">
                    Our Thought Partners
                </h1>

                <p className="tp-profile-subtitle">
                    Explore their profiles and connect with the one that resonates with you.
                </p>

                {/* Profile Grid Container (now scrollable) */}
                <div className="tp-profile-grid">
                    {PARTNERS.map((partner) => (
                        <div
                            key={partner.name}
                            className="tp-profile-item"
                            onClick={() => handleProfileClick(partner.name)}
                        >
                            <div className="tp-profile-image-wrapper">
                                <Image
                                    src={partner.imagePath}
                                    alt={`Profile picture of ${partner.name}`}
                                    width={85}
                                    height={85}
                                    className="tp-profile-image"
                                    priority
                                />
                            </div>
                            <span className="tp-profile-name">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Match Me Instead Button */}
                <button
                    className="tp-match-btn"
                    onClick={handleMatchMeClick}
                >
                    Match Me Instead
                </button>
            </div>
        </main>
    );
}