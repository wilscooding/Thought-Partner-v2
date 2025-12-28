"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- ICON COMPONENTS ---

// 1. My Profile (User Icon)
const UserIcon = () => (
    <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

// 2. Thought Partner Profiles (Book/File Icon)
const BookIcon = () => (
    <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

// 3. Match Me (Compass Icon)
const CompassIcon = () => (
    <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
);

// 4. Security & Privacy (Lock Icon)
const LockIcon = () => (
    <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

// --- MENU ITEMS WITH ICON REFERENCE ---

const MENU_ITEMS = [
    { name: "My Profile", path: "/tp/profile", Icon: UserIcon },
    { name: "Thought Partner Profiles", path: "/tp/profile-landing", Icon: BookIcon },
    { name: "Match Me", path: "/tp/setup-start", Icon: CompassIcon },
    { name: "Security & Privacy", path: "/user/security", Icon: LockIcon },
];

type SiteMenuProps = {
    burgerColor?: string;
};

export default function SiteMenu({ burgerColor = "#c2b280" }: SiteMenuProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleClose = () => setIsMenuOpen(false);
    const handleOpen = () => setIsMenuOpen(true);

    const handleNavigation = (path: string) => {
        router.push(path);
        handleClose();
    };

    return (
        <>
            {/* 1. Burger Menu Button (Positioned Top-Left) */}
            <button
                className="up-burger-btn"
                onClick={handleOpen}
                aria-label="Open Menu"
            >
                {/* Burger Icon SVG */}
                <svg viewBox="0 0 24 24" fill="none" stroke={burgerColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            {/* 2. Menu Overlay and Sidebar (Conditional Render) */}
            {isMenuOpen && (
                <div className="site-menu-overlay" onClick={handleClose}>
                    <div className="site-menu-sidebar" onClick={(e) => e.stopPropagation()}>

                        {/* Only close button remains */}
                        <div className="site-menu-header">
                            <button onClick={handleClose} className="site-menu-close-btn">×</button>
                        </div>

                        <nav className="site-menu-nav">
                            {MENU_ITEMS.map(item => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className="site-menu-item"
                                >
                                    {/* Renders the Icon component here */}
                                    <item.Icon />
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}