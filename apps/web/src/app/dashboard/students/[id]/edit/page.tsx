// src/app/dashboard/students/[id]/edit/page.tsx

import { StudentEditPageClient } from "@/features/students/components/student-edit-page-client";

type Params = { id: string };

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  return <StudentEditPageClient id={id} />;
}