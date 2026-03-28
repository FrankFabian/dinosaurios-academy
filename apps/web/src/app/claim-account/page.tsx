import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ClaimAccountClient } from "@/features/students/components/claim-account-client";

type SearchParams = {
  otp?: string;
};

export default async function ClaimAccountPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { otp } = await searchParams;

  if (!otp) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <h1 className="text-xl font-semibold text-zinc-100">Invalid claim link</h1>
        <p className="mt-2 text-sm text-zinc-400">Missing OTP token.</p>
      </main>
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    const callbackUrl = `/claim-account?otp=${encodeURIComponent(otp)}`;
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <ClaimAccountClient otp={otp} />
    </main>
  );
}
