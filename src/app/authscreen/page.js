"use client";

import { useState } from "react";
import Image from "next/image";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Tractor,
  User,
} from "lucide-react";

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

// Image now lives in /public, so it's referenced by its root-relative path.
const AUTH_IMAGE_SRC = "/loginBackground.jpg";

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
   <main className="flex h-screen w-full overflow-hidden bg-[#f5f7f4] text-[#17231d]">
      {/* Left: form */}
    <section className="flex w-full min-h-0 flex-col justify-center overflow-y-auto px-6  md:w-1/2 lg:px-16">
        <div className="mb-10 flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-[#214a38] uppercase">
          <span className="flex size-9 items-center justify-center rounded-xl  text-[#214a38]">
            <Tractor className="size-10" />
          </span>
          KisaanBazaar
        </div>

        <Card className="mx-auto w-full max-w-[440px] border-0 bg-transparent p-0 shadow-none">
          <CardHeader className="gap-6 p-0">
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

            {/* Mode tabs */}
            <div
              className="grid grid-cols-2 rounded-xl bg-[#eef3ed] p-1"
              role="tablist"
            >
              <button
                className={`my-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${mode === "login" ? "bg-white text-[#214a38] shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
                onClick={() => changeMode("login")}
                role="tab"
                type="button"
                aria-selected={mode === "login"}
              >
                Log in
              </button>
              <button
                className={`my-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${mode === "signup" ? "bg-white text-[#214a38] shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
                onClick={() => changeMode("signup")}
                role="tab"
                type="button"
                aria-selected={mode === "signup"}
              >
                Sign up
              </button>
            </div>

            {/* Account type pill toggle */}
            <div
              className="flex rounded-full bg-[#eef3ed] p-1 shadow-sm"
              role="group"
              aria-label="Account type"
            >
              <button
                aria-pressed={accountType === "user"}
                onClick={() => changeAccountType("user")}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold tracking-[0.05em] uppercase transition-all duration-200 ${accountType === "user" ? "bg-[#214a38] text-white shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
              >
                <User className="size-4" />
                I am a user
              </button>
              <button
                aria-pressed={accountType === "admin"}
                onClick={() => changeAccountType("admin")}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold tracking-[0.05em] uppercase transition-all duration-200 ${accountType === "admin" ? "bg-[#214a38] text-white shadow-sm" : "text-[#718078] hover:text-[#214a38]"}`}
              >
                <ShieldCheck className="size-4" />
                I am an admin
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
                      className="text-xs font-medium text-[#47705a] hover:underline underline-offset-2"
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
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
              {message ? (
                <p
                  className="rounded-lg border border-[#d6e7c9] bg-[#eef3ed] px-3 py-2 text-sm text-[#47705a]"
                  role="status"
                >
                  {message}
                </p>
              ) : null}

              <Button
                className="h-11 w-full bg-[#214a38] text-white transition-colors hover:bg-[#183a2c] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LockKeyhole className="size-4" />
                )}
                {isSubmitting
                  ? "Please wait..."
                  : mode === "login"
                    ? "Continue to Bazaar"
                    : "Create account"}
                {!isSubmitting ? (
                  <ArrowRight className="ml-auto size-4" />
                ) : null}
              </Button>

              <div className="relative flex items-center justify-center pt-2">
                <div className="absolute w-full border-t border-[#dbe5dc]" />
                <span className="relative bg-[#f5f7f4] px-4 text-xs font-medium tracking-[0.1em] text-[#a3b0a8] uppercase">
                  or
                </span>
              </div>

              <p className="text-center text-sm text-[#718078]">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      className="font-medium text-[#214a38] hover:underline underline-offset-2"
                      onClick={() => changeMode("signup")}
                    >
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-medium text-[#214a38] hover:underline underline-offset-2"
                      onClick={() => changeMode("login")}
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>

              <p className="text-center text-xs leading-5 text-muted-foreground">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </form>

            <div className="mt-8 flex justify-center gap-4 md:justify-start">
              <div className="flex cursor-default items-center gap-1.5 rounded-full border border-[#dbe5dc] bg-white px-3 py-1.5 text-[#47705a] shadow-sm">
                <ShieldCheck className="size-4" />
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase">
                  Encrypted by default
                </span>
              </div>
              <div className="flex cursor-default items-center gap-1.5 rounded-full border border-[#dbe5dc] bg-white px-3 py-1.5 text-[#47705a] shadow-sm">
                <Check className="size-4" />
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase">
                  Simple, focused, yours
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Right: visual panel */}
      <aside className="relative hidden h-full w-1/2 flex-col justify-end overflow-hidden bg-[#214a38] p-16 text-[#f4f6ed] md:flex">
        <Image
          src={AUTH_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes="50vw"
          className="scale-105 object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#214a38] via-[#214a38]/80 to-[#214a38]/20" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl leading-tight font-medium tracking-[-0.04em]">
         Direct from Farm to Commercial Scale.
          </h2>
          <p className="mt-5 text-base leading-6 text-[#c4d8c4]">
          Access transparent pricing, real-time inventory, and verified logistics partners to streamline your wholesale agricultural supply chain.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <div className="mb-1 flex items-center gap-2">
                <Check className="size-4 text-[#d6e7c9]" />
                <span className="text-sm font-semibold">Stay in sync</span>
              </div>
              <p className="text-xs text-[#c4d8c4]">
                Everyone sees the same next step.
              </p>
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <div className="mb-1 flex items-center gap-2">
                <LockKeyhole className="size-4 text-[#d6e7c9]" />
                <span className="text-sm font-semibold">Built to last</span>
              </div>
              <p className="text-xs text-[#c4d8c4]">
                Secure, simple, and yours.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}