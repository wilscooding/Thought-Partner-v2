"use client";

import React from "react";
import Image from "next/image";
import SiteMenu from "@/components/SiteMenu";

export default function UserProfilePage() {
    return (
        <main className="dark-profile-page">
            {/* Site Menu with Beige/Gold variant */}
            <SiteMenu burgerColor="#d4c3a3" />

            {/* Beige/Gold Logo Top Right */}
            <Image
                src="/Logo Gold.png"
                alt="App Logo"
                width={50}
                height={50}
                priority
                className="up-logo-top-right"
            />

            <div className="profile-shell">
                {/* 1. Name Input Row - Fixed at top [cite: 1, 2] */}
                <div className="profile-name-row">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="rect-name-input"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="rect-name-input"
                    />
                </div>

                {/* 2. THE PARENT BOX: questions-grid */}
                <div className="questions-grid">

                    {/* 3. THE CHILD SCROLLER: profile-questions-scroller */}
                    <div className="profile-questions-scroller">

                        <div className="profile-question-group">
                            <h2 className="profile-label">What age range are you in?</h2>
                            <button className="rect-selection-pill">
                                Select Range
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">Choose the gender identity that fits you.</h2>
                            <button className="rect-selection-pill">
                                Select Identity
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">What professional identity feels most like you?</h2>
                            <button className="rect-selection-pill">
                                Select Identity
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">What industry feels most aligned with your work?</h2>
                            <button className="rect-selection-pill">
                                Select Industry
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">Roughly how many years have you been in your field?</h2>
                            <button className="rect-selection-pill">
                                Select Years
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">Choose the word that best fits your thinking style.</h2>
                            <button className="rect-selection-pill">
                                Select Style
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">Choose the word that best fits your energy style.</h2>
                            <button className="rect-selection-pill">
                                Select Style
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">Choose the word that best fits your communication style.</h2>
                            <button className="rect-selection-pill">
                                Select Style
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        <div className="profile-question-group">
                            <h2 className="profile-label">Choose the word that best fits your relational style.</h2>
                            <button className="rect-selection-pill">
                                Select Style
                                <svg className="pill-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>
                    </div> {/* End Scroller */}
                </div> {/* End Box Parent */}

                {/* 3. Footer with Update Button [cite: 12] */}
                <footer className="profile-footer">
                    <button className="profile-update-btn">
                        Update
                    </button>
                </footer>
            </div>
        </main>
    );
}