import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center px-6 py-12">
        <section className="w-full space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Dinosaurios Academy</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Manage students, groups and attendance from one dashboard.
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Staff and coaches can work in one place. Students receive secure account claim links by email.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-400">
              <Link href="/login">Sign in with Google</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
