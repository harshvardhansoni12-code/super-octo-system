"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("NextAuth session:", session);
    console.log("NextAuth status:", status);
  }, [session, status]);

  async function handleSubmit(event) {
    event.preventDefault();
  }

  if (result?.error) {
    setError("Invalid email or password.");
    return;
  }

  setError("Login successful.");
  return <div></div>;
}
