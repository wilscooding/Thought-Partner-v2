"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteMenu from "@/components/SiteMenu";


// Phone Icon SVG
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="connect-phone-icon"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.71-4.71 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.74A14.28 14.28 0 0 0 9.87 7.7a2 2 0 0 1-.33 2.13l-1.9 1.9a15.4 15.4 0 0 0 6.55 6.55l1.9-1.9a2 2 0 0 1 2.13-.33 14.28 14.28 0 0 0 3.96 1.63 2 2 0 0 1 1.74 2z" />
  </svg>
);

// Long-tail back arrow (bottom left)
const BottomBackArrowIcon = () => (
  <svg
    viewBox="0 0 40 24"
    className="tp-detail-back-icon"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* tail */}
    <line x1="36" y1="12" x2="8" y2="12" />
    {/* head */}
    <polyline points="14 8 8 12 14 16" />
  </svg>
);

// --- DATA ---
const PARTNER_PROFILES = {
  "Denise Okoro": {
    imagePath: "/Denise Okoro.webp",
    description:
      "Firm, supportive, and pragmatic, Denise Okoro helps you cut through the noise and focus on what matters. With a grounded, big-sister energy, she keeps you centered and moving forward.",
    useCases: [
      "Overwhelmed and need clear priorities",
      "Stuck and struggling to make progress",
      "Mentally scattered and craving steadiness",
      'In a "just tell me what matters" mindset',
    ],
    lastConnectedDate: "November 28, 2025",
  },
} as const;

type PartnerName = keyof typeof PARTNER_PROFILES;

interface SelectedTPProfilePageProps {
  partnerName?: PartnerName;
}

export default function SelectedTPProfilePage({
  partnerName = "Denise Okoro",
}: SelectedTPProfilePageProps) {
  const router = useRouter();
  const partner = PARTNER_PROFILES[partnerName];

  if (!partner) {
    return <main className="dark-landing-page">Partner not found.</main>;
  }

  const isPreviouslyConnected = !!partner.lastConnectedDate;

  return (
    <main className="dark-landing-page tp-detail-page">
      {/* Burger menu (top-left) */}
      <SiteMenu />

      {/* Logo top-right, same as other dark pages */}
      <Image
        src="/Logo Gold.png"
        alt="App Logo"
        width={56}
        height={56}
        priority={true}
        className="main-logo-top-right"
      />

      {/* Main content */}
      <div className="tp-detail-shell">
        {/* Image + Name row */}
        <div className="tp-detail-header-row">
          <div className="tp-detail-image-wrapper">
            <Image
              src={partner.imagePath}
              alt={`Profile picture of ${partnerName}`}
              width={80}
              height={80}
              className="tp-detail-image"
              priority
            />
          </div>
          <h1 className="tp-detail-name">{partnerName}</h1>
        </div>

        {/* Description */}
        <p className="tp-detail-description">{partner.description}</p>

        {/* Best to use when... */}
        <h2 className="tp-detail-use-header">Best to use when you’re…</h2>

        <ul className="tp-detail-use-list">
          {partner.useCases.map((useCase, index) => (
            <li key={index} className="tp-detail-use-item">
              {useCase}
            </li>
          ))}
        </ul>

        {/* Previously Connected section */}
        {isPreviouslyConnected && (
          <div className="tp-detail-previous-section">
            <div className="tp-detail-divider" />
            <span className="tp-previous-status">Previously Connected</span>
            <span className="tp-previous-date">
              Last Conversation: {partner.lastConnectedDate}
            </span>
          </div>
        )}
      </div>

      {/* Bottom nav: back arrow + phone button */}
      <div className="tp-detail-bottom-nav">
        <button
          type="button"
          className="tp-detail-back-btn"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <BottomBackArrowIcon />
        </button>

        <button
          className="tp-detail-connect-btn"
          onClick={() =>
            console.log(`Starting session with ${partnerName}`)
          }
          aria-label={`Connect with ${partnerName}`}
        >
          <div className="tp-connect-icon-circle">
            <PhoneIcon />
          </div>
        </button>
      </div>
    </main>
  );
}
