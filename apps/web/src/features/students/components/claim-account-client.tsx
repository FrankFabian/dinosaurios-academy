"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function ClaimAccountClient({ otp }: { otp: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => {
      router.push("/dashboard/student");
    }, 1200);
    return () => clearTimeout(timer);
  }, [status, router]);

  async function onClaim() {
    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/students/claim-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error || "Failed to claim account");
      }

      setStatus("success");
      setMessage("Your student account is now linked. Redirecting to your dashboard...");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to claim account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-white/10 bg-black/40 p-6">
      <h1 className="text-xl font-semibold text-zinc-100">Claim Student Account</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Confirm to link this student profile with your current Google account.
      </p>

      {status !== "idle" ? (
        <div
          className={`mt-4 rounded-md border px-3 py-2 text-sm ${
            status === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mt-5">
        <Button onClick={onClaim} disabled={isSubmitting}>
          {isSubmitting ? "Linking..." : "Link my account"}
        </Button>
      </div>
    </Card>
  );
}
