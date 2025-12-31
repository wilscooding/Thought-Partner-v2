"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await getRedirectResult(auth);
      } catch {
        // No redirect happened — ignore
      }
    })();
  }, []);


  // Removed FormEvent type annotation for plain JS compatibility -> Added back for TS
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (err) {
      console.error(err);

      let errorMessage = "Login failed, Please check your credentials.";
      if (err && typeof err == 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: implement real reset flow
    alert("Forgot Password flow coming soon.");
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithRedirect(auth, provider);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Google sign-in failed.");
  //   }
  // };

  const handleGoogleLogin = async () => {
    setLoading(true); // Show the "Logging in..." state
    try {
      const provider = new GoogleAuthProvider();
      // Use Popup instead of Redirect
      const result = await signInWithPopup(auth, provider);

      // If we get here, the user is logged in!
      console.log("Logged in user:", result.user.email);
      router.push("/home"); // Send them home
    } catch (err) {
      console.error("Google Error:", err);
      alert("Google sign-in failed. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };



  const handleAppleLogin = () => {
    // TODO: wire Apple provider
    alert("Apple sign-in coming soon.");
  };

  return (
    <main className="page-auth">
      {/* ===== LOGO: Updated to match PDF and use Logo Gold.png ===== */}
      <div className="mb-10 auth-logo-wrapper">
        <Image
          src="/Logo Gold.png"
          alt="App Logo"
          width={120}
          height={120}
          priority={true}
          // Class for large, centered logo as seen in the PDF
          className="login-main-logo"
        />
      </div>

      <div className="auth-shell">
        {/* ===== FORM (USERNAME + PASSWORD + LOGIN) ===== */}
        <form onSubmit={onSubmit}>
          {/* Username */}
          <label className="auth-label" htmlFor="email">
            Username:
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
          <div className="input-wrapper">
            <input
              id="password"
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="input-icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-8-11-8a20.19 20.19 0 0 1 5.06-7.94" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                </svg>
              ) : (
                // Eye (show password)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>

          </div>

          {/* Forgot Password */}
          <div className="mt-[-0.5rem] mb-4 text-center">
            <button
              type="button"
              className="auth-link"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Log In button */}
          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* ===== DIVIDER ===== */}
        <div className="divider-row">
          <div className="divider-line" />
          <span className="divider-text">Or continue with</span>
          <div className="divider-line" />
        </div>

        {/* ===== SOCIAL LOGIN BUTTONS ===== */}
        <button
          type="button"
          className="auth-btn-social"
          onClick={handleGoogleLogin}
        >
          <span className="social-icon">
            {/* Google SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.3H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 7.1 29.3 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.4-3.9z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.9C14.7 15.5 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 7.1 29.3 5 24 5 16.2 5 9.5 9.4 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 47c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 38.8 26.7 40 24 40c-5.3 0-9.8-3.3-11.4-8l-6.6 5C9.4 42.6 16.1 47 24 47z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.3H42V20H24v8h11.3c-.7 2.1-2 3.9-3.7 5.3v.1l6.3 5.2c-.4.4 4.1-3.4 6.2-9.6.4-1.2.4-2.6.4-3.9 0-1.3-.1-2.7-.4-3.8z"
              />
            </svg>
          </span>
          Continue with Google
        </button>

        <button
          type="button"
          className="auth-btn-social"
          onClick={handleAppleLogin}
        >
          <span className="social-icon">
            {/* Apple SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 384 512"
              fill="black"
            >
              <path d="M318.7 268.7c-.3-36.7 16.3-64.4 50.6-84.9-19.1-27.5-47.8-42.7-85.8-45.6-36.1-2.8-76.3 21.3-91 21.3-15.2 0-50-20.3-77.4-20.3C59.1 138.7 0 184.6 0 273.5c0 26.1 4.7 52.3 14.2 79 12.6 36.7 57.8 126.7 104.8 125.3 24.6-.6 42-17.4 74-17.4 31.4 0 47.6 17.4 75.4 17.4 47-.7 86.6-82.4 98.7-119.3-62.7-29.3-78.4-96.7-78.4-89.8zM259.9 77.3c27.3-32.4 24.8-61.9 24-72.3-24.1 1.4-52 16.4-68.3 35.8-17.5 20.8-27.7 46.4-25.5 73.6 26.3 2 50.9-12.1 69.8-37.1z" />
            </svg>
          </span>
          Continue with Apple
        </button>

        {/* ===== FOOTER ===== */}
        <div className="auth-footer">
          Don’t have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => router.push("/auth/register")}
          >
            Create One
          </button>
        </div>
      </div>
    </main>
  );
}