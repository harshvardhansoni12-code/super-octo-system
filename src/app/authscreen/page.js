"use client";

import { useState } from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [accountType, setAccountType] = useState("user");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  function changeAccountType(nextAccountType) {
    setAccountType(nextAccountType);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const isAdmin = accountType === "admin";

    try {
      if (mode === "signup") {
        const response = await fetch(
          isAdmin ? "/api/v1/admin/create" : "/api/v1/user/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.get("name"),
              email,
              password,
            }),
          },
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error ||
              `Unable to create your ${isAdmin ? "admin" : "user"} account.`,
          );
        }

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Account created. Please sign in to continue.");
        }
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Invalid email or password.");
        }
      }

      const session = await getSession();
      const expectedRole = isAdmin ? "ADMIN" : "USER";

      if (session?.user?.role !== expectedRole) {
        await signOut({ redirect: false });
        throw new Error(
          `This account is not registered as an ${isAdmin ? "admin" : "user"}.`,
        );
      }

      router.replace(isAdmin ? "/admin-dashboard" : "/user-dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7f4] px-4 py-10 text-[#17231d]">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#d7e7d8] opacity-70 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#f2d9b8] opacity-60 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#d9e2d8] bg-white shadow-[0_24px_80px_rgba(41,65,49,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#214a38] px-10 py-12 text-[#f4f6ed] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-16 top-20 h-56 w-56 rounded-full border-28 border-[#b5cfb5]/20" />
          <div className="relative">
            <div className="mb-12 flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#d6e7c9] text-[#214a38]">
                <Sparkles className="size-4" />
              </span>
              NEST
            </div>
            <p className="max-w-sm text-4xl leading-tight font-medium tracking-[-0.04em]">
              A calmer place to get things done.
            </p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#c4d8c4]">
              Keep your work, people, and next steps moving together.
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-[#c4d8c4]">
            <Check className="size-4 text-[#d6e7c9]" /> Simple, focused, yours.
          </div>
        </section>

        <Card className="rounded-none border-0 bg-transparent py-8 shadow-none sm:py-12">
          <CardHeader className="gap-6 px-6 sm:px-12">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#47705a] uppercase lg:hidden">
              <Sparkles className="size-4" /> NEST
            </div>
            <div>
              <CardTitle className="text-3xl tracking-[-0.04em]">
                {mode === "login"
                  ? `Welcome back${accountType === "admin" ? ", admin" : ""}`
                  : `Create your ${accountType === "admin" ? "admin" : "user"} account`}
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {mode === "login"
                  ? "Sign in to pick up where you left off."
                  : "Start with a few details. It only takes a minute."}
              </CardDescription>
            </div>
            <div
              className="grid grid-cols-2 rounded-xl bg-[#eef3ed] p-1"
              role="tablist"
            >
              <button
                className={`rounded-lg px-3 py-2 my-1 text-sm font-medium transition-colors ${mode === "login" ? "bg-white text-[#214a38] shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
                onClick={() => changeMode("login")}
                role="tab"
                type="button"
                aria-selected={mode === "login"}
              >
                Log in
              </button>
              <button
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${mode === "signup" ? "bg-white text-[#214a38] shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
                onClick={() => changeMode("signup")}
                role="tab"
                type="button"
                aria-selected={mode === "signup"}
              >
                Sign up
              </button>
            </div>
            <div
              className="grid grid-cols-2 rounded-xl border border-[#dbe5dc] p-1"
              role="group"
              aria-label="Account type"
            >
              {[
                ["user", "User"],
                ["admin", "Admin"],
              ].map(([type, label]) => (
                <button
                  aria-pressed={accountType === type}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${accountType === type ? "bg-[#214a38] text-white shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
                  key={type}
                  onClick={() => changeAccountType(type)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-6 sm:px-12">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Alex Morgan"
                    autoComplete="name"
                    required
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" ? (
                    <button
                      className="text-xs font-medium text-[#47705a] hover:underline"
                      type="button"
                    >
                      Forgot password?
                    </button>
                  ) : null}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={
                    mode === "signup"
                      ? "At least 6 characters"
                      : "Enter your password"
                  }
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={mode === "signup" ? 6 : undefined}
                  required
                />
              </div>
              {error ? (
                <p
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="text-sm text-[#47705a]" role="status">
                  {message}
                </p>
              ) : null}
              <Button
                className="h-11 w-full bg-[#214a38] text-white hover:bg-[#183a2c]"
                type="submit"
                disabled={isSubmitting}
              >
                <LockKeyhole className="size-4" />
                {isSubmitting
                  ? "Please wait..."
                  : mode === "login"
                    ? "Continue to NEST"
                    : "Create account"}
                {!isSubmitting ? (
                  <ArrowRight className="ml-auto size-4" />
                ) : null}
              </Button>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
