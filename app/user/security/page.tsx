"use client";

import React from "react";
import Image from "next/image";
import SiteMenu from "@/components/SiteMenu";

export default function PrivacySecurityPage() {
    return (
        <main className="dark-profile-page">
            <SiteMenu burgerColor="#d4c3a3" />

            <Image
                src="/Logo Gold.png"
                alt="App Logo"
                width={50}
                height={50}
                priority
                className="up-logo-top-right"
            />

            <div className="profile-shell">
                <h1 className="profile-title">Update Password</h1>

                {/* Fields are now direct children of the shell, no box or scroller */}
                <div className="profile-question-group">
                    <h2 className="profile-label">Enter Current Password</h2>
                    <input
                        type="password"
                        className="rect-password-input"
                        placeholder="••••••••"
                    />
                </div>

                <div className="profile-question-group">
                    <h2 className="profile-label">Enter New Password</h2>
                    <input
                        type="password"
                        className="rect-password-input"
                        placeholder="••••••••"
                    />
                </div>

                <div className="profile-question-group">
                    <h2 className="profile-label">Re-enter New Password</h2>
                    <input
                        type="password"
                        className="rect-password-input"
                        placeholder="••••••••"
                    />
                </div>

                <footer className="profile-footer">
                    <button className="profile-update-btn">Update</button>
                </footer>

                <div className="security-extra-links">
                    <a href="#" className="terms-link">Terms and Conditions</a>
                </div>
            </div>
        </main>
    );
}