"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
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
      router.replace("/home");
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Account creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-auth">
      {/* Logo */}
      <div className="mb-10">
        <img
          src="/logo.png"
          alt="Thought Partner Logo"
          style={{ width: 80, height: 80 }}
        />
      </div>

      <div className="auth-shell">
        <form onSubmit={onSubmit}>
          {/* Title */}
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
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
            placeholder="Enter a password"
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
            placeholder="Re-enter your password"
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
              I agree to the Terms &amp; Conditions
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
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
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
