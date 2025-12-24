"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";

// --- DATA: List of Thought Partners ---
// For now, we derive avatarId from name (slug).
// Later, you can swap this to pull from /api/avatars and use real ids.
const PARTNERS = [
    { name: "Denise Okoro", imagePath: "/Denise Okoro.webp" },
    { name: "Alex Rowan", imagePath: "/Alex Rowan.webp" },
    { name: "Emery Jules", imagePath: "/Emery Jules.webp" },
    { name: "Nadine Shah", imagePath: "/Nadine Shah.webp" },
    { name: "Leo Tran", imagePath: "/Leo Tran.webp" },
    { name: "Elliott Stein", imagePath: "/Elliott Stein.webp" },
    { name: "Ellis Reed", imagePath: "/Ellis Reed.webp" },
    { name: "Rosa Alvarez", imagePath: "/Rosa Alvarez.webp" },
    { name: "Theo Lane", imagePath: "/Theo Lane.webp" },
    { name: "River Quinn", imagePath: "/River Quinn.webp" },
    { name: "Rami Ellis", imagePath: "/Rami Ellis.webp" },
    { name: "Jordan Lane", imagePath: "/Jordan Lane.webp" },
];

const toAvatarId = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, "_"); // "Denise Okoro" -> "denise_okoro"

export default function TPProfileLandingPage() {
    const router = useRouter();

    const handleProfileClick = (name: string) => {
        const avatarId = toAvatarId(name);
        router.push(`/tp/selected-tp?avatarId=${encodeURIComponent(avatarId)}`);
    };

    const handleMatchMeClick = () => {
        // This starts the "match me" flow (no avatar selected yet)
        router.push("/tp/setup-start");
    };

    return (
        <main className="dark-landing-page">
            <SiteMenu />

            <Image
                src="/Logo Gold.png"
                alt="App Logo"
                width={56}
                height={56}
                priority
                className="main-logo-top-right"
            />

            <div className="tp-profile-shell">
                <h1 className="tp-profile-title">Our Thought Partners</h1>

                <p className="tp-profile-subtitle">
                    Explore their profiles and connect with the one that resonates with you.
                </p>

                <div className="tp-profile-grid">
                    {PARTNERS.map((partner) => (
                        <button
                            key={partner.name}
                            type="button"
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
                            <span className="tp-profile-name">{partner.name}</span>
                        </button>
                    ))}
                </div>

                <button className="tp-match-btn" onClick={handleMatchMeClick} type="button">
                    Match Me Instead
                </button>
            </div>
        </main>
    );
}
