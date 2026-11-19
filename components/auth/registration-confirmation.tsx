"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type ConfirmationState = "checking" | "ready" | "error";

async function completeRegistration(accessToken: string) {
  const response = await fetch("/api/auth/complete-student-registration", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const result = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? "Student account setup could not be completed.");
  }
}

export function RegistrationConfirmation() {
  const [state, setState] = useState<ConfirmationState>("checking");
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyAndProvision() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;
        if (!data.session) {
          throw new Error("This confirmation link is invalid or expired. Request a new registration email.");
        }

        if (active) setAccessToken(data.session.access_token);
        await completeRegistration(data.session.access_token);

        if (active) {
          setState("ready");
          setMessage("Your email is verified and your student profile is active. You can now sign in.");
        }
      } catch (error) {
        if (active) {
          setState("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "Email confirmation could not be completed. Please try again.",
          );
        }
      }
    }

    void verifyAndProvision();
    return () => {
      active = false;
    };
  }, []);

  async function retryProvisioning() {
    if (!accessToken || isRetrying) return;

    setIsRetrying(true);
    try {
      await completeRegistration(accessToken);
      setState("ready");
      setMessage("Your email is verified and your student profile is active. You can now sign in.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Student account setup could not be completed. Please try again.",
      );
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#142344]">
          Confirm your email
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          We&apos;re verifying your email and preparing your student profile.
        </p>
      </div>

      <div
        role={state === "error" ? "alert" : "status"}
        className={`rounded-xl border px-4 py-4 text-sm leading-6 ${
          state === "error"
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : state === "ready"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-indigo-100 bg-indigo-50 text-indigo-800"
        }`}
      >
        <div className="flex items-start gap-2.5">
          {state === "checking" ? (
            <LoaderCircle size={18} className="mt-0.5 shrink-0 animate-spin" />
          ) : state === "ready" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{message || "Checking your confirmation link..."}</p>
        </div>
      </div>

      {state === "error" && accessToken ? (
        <Button
          type="button"
          className="mt-4 w-full"
          disabled={isRetrying}
          onClick={retryProvisioning}
        >
          {isRetrying ? "Retrying setup..." : "Retry student setup"}
        </Button>
      ) : null}

      {state === "ready" ? (
        <Link
          href="/login"
          className="mt-5 block text-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          Continue to login
        </Link>
      ) : null}
    </div>
  );
}
