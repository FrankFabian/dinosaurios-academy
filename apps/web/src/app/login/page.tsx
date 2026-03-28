import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card } from "@/components/ui/card";
import { LoginGoogleButton } from "./login-google-button";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-md items-center px-6">
        <Card className="w-full border-white/10 bg-black/40 p-6">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Use your Google account to continue to the Dinosaurios Academy portal.
          </p>

          <div className="mt-6">
            <LoginGoogleButton />
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            If your student profile is not linked yet, use the claim link sent to your email first.
          </p>
        </Card>
      </div>
    </main>
  );
}
