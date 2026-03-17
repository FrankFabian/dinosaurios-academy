import { listGroupFormOptionsDb } from "@/features/groups/repository";
import { NextResponse } from "next/server";

export async function GET() {
  const options = await listGroupFormOptionsDb();
  return NextResponse.json({ data: options });
}
