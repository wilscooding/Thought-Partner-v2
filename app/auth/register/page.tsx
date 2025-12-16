"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!agreeTerms || !confirmAge) {
      alert("Please agree to the terms and confirm your age.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigate to the next onboarding step
      router.replace("/up/welcome");
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Account creation failed.";
      if (err && typeof err == 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-auth page-auth-register"> {/* <--- NEW CLASS ADDED HERE */}
      {/* ===== TOP-RIGHT LOGO ===== */}
      <Image src="/Logo Gold.png" alt="App Logo" width={56} height={56} priority={true} className="up-logo-top-right" />

      <div className="auth-shell">
        <form onSubmit={onSubmit}>
          <h1 className="auth-title-large">
            Create Account
          </h1>

          {/* Email */}
          <label className="auth-label" htmlFor="email">
            Email:
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password */}
          <label className="auth-label" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          {/* Confirm Password */}
          <label className="auth-label" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            className="auth-input"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {/* Terms / Age checkboxes */}
          <label className="auth-checkbox-row">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>
              I agree to the terms and conditions
            </span>
          </label>

          <label className="auth-checkbox-row">
            <input
              type="checkbox"
              checked={confirmAge}
              onChange={(e) => setConfirmAge(e.target.checked)}
            />
            <span>I confirm that I am 18 years of age or older.</span>
          </label>

          {/* Create Account button */}
          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading || !agreeTerms || !confirmAge}
          >
            {loading ? "Creating account..." : "Submit"}
          </button>
        </form>

        {/* Footer: Already have an account? */}
        <div className="auth-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => router.push("/auth/login")}
          >
            Log In
          </button>
        </div>
      </div>
    </main>
  );
}