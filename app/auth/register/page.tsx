"use client";

import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        createdAt: serverTimestamp(),
      });
      router.replace("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xs space-y-4 border border-gray-800 rounded-2xl p-4"
      >
        <h1 className="text-xl font-semibold text-center">Create Account</h1>

        <input
          className="w-full px-3 py-2 rounded-lg bg-black border border-gray-700 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full px-3 py-2 rounded-lg bg-black border border-gray-700 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-white text-black text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
    </main>
  );
}
