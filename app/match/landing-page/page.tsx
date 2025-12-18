"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";

export default function MatchLandingPage() {
    const router = useRouter();

    return (
        <main className="light-bg-page match-landing-page">
            {/* Burger menu (top-left) */}
            <SiteMenu burgerColor="#2f2b25" />

            {/* Logo top-right */}
            <Image
                src="/Logo Dark.png"
                alt="App Logo"
                width={56}
                height={56}
                priority={true}
                className="main-logo-top-right"
            />

            <div className="match-shell">
                <div className="match-content">
                    <h1 className="match-title">
                        Before I match you, I just need a few quick details. {/*  */}
                    </h1>

                    <p className="match-subtitle">
                        This helps me choose the best fit for your session. {/*  */}
                    </p>
                </div>

                <button
                    className="match-begin-btn"
                    onClick={() => router.push("/match-steps")}
                    type="button"
                >
                    Begin {/*  */}
                </button>
            </div>
        </main>
    );
}