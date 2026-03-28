"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginGoogleButton() {
  return (
    <Button
      type="button"
      className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      Continue with Google
    </Button>
  );
}
