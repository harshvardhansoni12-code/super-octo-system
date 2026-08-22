"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("NextAuth session:", session);
    console.log("NextAuth status:", status);
  }, [session, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    setError("Login successful.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow dark:bg-zinc-900"
      >
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Sign in
        </h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border border-zinc-300 p-3 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded border border-zinc-300 p-3 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-zinc-900 p-3 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        {error && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{error}</p>
        )}
      </form>
    </div>
  );
}
