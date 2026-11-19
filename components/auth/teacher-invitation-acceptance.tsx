"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type InvitationState = "checking" | "ready" | "saving" | "complete" | "error";

export function TeacherInvitationAcceptance() {
  const [state, setState] = useState<InvitationState>("checking");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let active = true;

    async function verifyInvitation() {
      try {
        const supabase = getSupabaseBrowserClient();
        const callbackUrl = new URL(window.location.href);
        const tokenHash = callbackUrl.searchParams.get("token_hash");
        const callbackType = callbackUrl.searchParams.get("type");
        if (!tokenHash || callbackType !== "invite") {
          throw new Error("This invitation link is invalid or expired. Ask your administrator for a new invitation.");
        }
        const { data: verificationData, error: verificationError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "invite",
        });
        if (verificationError) throw verificationError;
        if (!verificationData.session) {
          throw new Error("The invitation link is invalid or expired.");
        }

        const { data: userData, error: userError } = await supabase.auth.getUser(
          verificationData.session.access_token,
        );
        if (userError) throw userError;
        if (!userData.user) throw new Error("The invitation session could not be verified.");

        const [roleResult, profileResult] = await Promise.all([
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userData.user.id)
            .eq("role", "teacher")
            .maybeSingle(),
          supabase
            .from("teacher_profiles")
            .select("user_id")
            .eq("user_id", userData.user.id)
            .maybeSingle(),
        ]);
        if (roleResult.error || profileResult.error) {
          throw roleResult.error ?? profileResult.error;
        }
        if (!roleResult.data || !profileResult.data) {
          throw new Error("This link is not a valid teacher invitation.");
        }

        window.history.replaceState({}, document.title, "/auth/invite");
        if (active) setState("ready");
      } catch (error) {
        if (active) {
          setState("error");
          setMessage(
            error instanceof Error
              ? error.message
              : "The teacher invitation could not be verified.",
          );
        }
      }
    }

    void verifyInvitation();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state !== "ready") return;
    if (password.length < 8) {
      setMessage("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setState("saving");
    setMessage("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;

      setState("complete");
      setMessage("Your password is ready. Sign in with the common login page.");
    } catch (error) {
      setState("ready");
      setMessage(
        error instanceof Error
          ? error.message
          : "Your password could not be saved. Please try again.",
      );
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#142344]">
          Set your password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Create a personal password to access your teacher account.
        </p>
      </div>

      {state === "checking" || state === "saving" ? (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-4 text-sm text-indigo-800">
          <LoaderCircle size={18} className="animate-spin" />
          {state === "checking" ? "Verifying your invitation..." : "Saving your password..."}
        </div>
      ) : null}

      {state === "error" || state === "complete" ? (
        <div
          role={state === "error" ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-xl border px-4 py-4 text-sm leading-6 ${
            state === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {state === "error" ? <TriangleAlert size={18} className="mt-1 shrink-0" /> : <CheckCircle2 size={18} className="mt-1 shrink-0" />}
          <p>{message}</p>
        </div>
      ) : null}

      {state === "ready" ? (
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <PasswordInput
            label="New password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setMessage("");
            }}
          />
          <PasswordInput
            label="Confirm password"
            name="confirm-password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setMessage("");
            }}
          />
          {message ? <p role="alert" className="text-sm text-rose-700">{message}</p> : null}
          <Button type="submit" size="lg" className="w-full">
            Set password
          </Button>
        </form>
      ) : null}

      {state === "complete" ? (
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
