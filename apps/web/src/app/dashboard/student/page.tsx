import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/server/db";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return <div className="text-sm text-red-400">Session not found.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          category: true,
          status: true,
        },
      },
    },
  });

  if (!user?.student) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-zinc-100">Student Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Your account is not linked to a student profile yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold text-zinc-100">Student Dashboard</h1>
      <p className="text-sm text-zinc-300">
        Welcome, {user.student.firstName} {user.student.lastName}.
      </p>
      <p className="text-sm text-zinc-400">
        Category: {user.student.category} · Status: {user.student.status}
      </p>
    </div>
  );
}
