"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type LogoutButtonProps = Omit<ButtonProps, "onClick"> & {
  onLogout?: () => void;
};

export function LogoutButton({ onLogout, ...buttonProps }: LogoutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setErrorMessage("");

    try {
      onLogout?.();
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      if (error) {
        setErrorMessage("Sign-out failed. Check your connection and try again.");
        return;
      }

      router.replace("/login");
    } catch {
      setErrorMessage("Sign-out failed. Check your connection and try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <Button
        {...buttonProps}
        disabled={isSigningOut || buttonProps.disabled}
        onClick={handleLogout}
        aria-busy={isSigningOut}
      />
      {errorMessage ? (
        <p
          role="alert"
          className="fixed right-4 top-20 z-[100] max-w-sm rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-lg"
        >
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
