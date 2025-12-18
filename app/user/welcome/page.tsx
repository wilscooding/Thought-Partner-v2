"use client";

import React from "react";
import Image from "next/image";

export default function WelcomePage() {
    return (
        <main className="dark-profile-page">
            <div className="profile-shell welcome-center">

                <Image
                    src="/Logo Gold.png"
                    alt="Thought Partner Logo"
                    width={120}
                    height={120}
                    className="welcome-logo"
                />

                <h1 className="welcome-title">Welcome to Thought Partner!</h1>

                <div className="agreement-checks">
                    {/* Circle Checkbox 1 */}
                    <label className="checkbox-group">
                        <input type="checkbox" className="custom-circle-checkbox" />
                        <span className="checkbox-text">I agree to the terms and conditions</span>
                    </label>

                    {/* Circle Checkbox 2 */}
                    <label className="checkbox-group">
                        <input type="checkbox" className="custom-circle-checkbox" />
                        <span className="checkbox-text">I confirm that I am 18 years of age or older.</span>
                    </label>
                </div>

                <footer className="profile-footer">
                    <button className="profile-update-btn">Submit</button>
                </footer>
            </div>
        </main>
    );
}