"use client";

import React from "react";
import Image from "next/image";
import SiteMenu from "@/components/SiteMenu";

export default function TermsPage() {
    return (
        <main className="dark-profile-page">
            {/* Site Menu with Gold burger icon */}
            <SiteMenu burgerColor="#d4c3a3" />

            {/* Beige/Gold Logo Top Right  */}
            <Image
                src="/Logo Gold.png"
                alt="App Logo"
                width={50}
                height={50}
                priority
                className="up-logo-top-right"
            />

            <div className="profile-shell">
                {/* Title */}
                <h1 className="profile-terms-title">Terms and Conditions for Thought Partner</h1>

                {/* Boxed container for legal content */}
                <div className="questions-grid">
                    <div className="profile-questions-scroller">
                        {/* Legal placeholder text */}
                        <p className="legal-text-placeholder">
                            Terms and conditions placeholder. Some legal language will be placed here.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <footer className="profile-footer">
                    <button className="profile-update-btn">
                        All Set
                    </button>
                </footer>
            </div>
        </main>
    );
}