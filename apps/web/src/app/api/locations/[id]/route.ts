import { mapLocationToRow } from "@/features/locations/mappers";
import { getLocationDb, updateLocationDb } from "@/features/locations/repository";
import { updateLocationSchema, zodErrorToResponse } from "@/features/locations/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const location = await getLocationDb(id);
  if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: mapLocationToRow(location) });
}

export async function PATCH(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const payload = await req.json();
  const parsed = updateLocationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;
  const data: Prisma.LocationUncheckedUpdateInput = {};

  if (body.name !== undefined) data.name = body.name.trim();
  if (body.address !== undefined) data.address = body.address.trim();
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl;
  if (body.mapsUrl !== undefined) data.mapsUrl = body.mapsUrl;
  if (body.embedUrl !== undefined) data.embedUrl = body.embedUrl;
  if (body.status !== undefined) data.status = body.status;

  try {
    const updated = await updateLocationDb(id, data);
    return NextResponse.json({ data: mapLocationToRow(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Location already exists" }, { status: 409 });
      }
    }

    throw error;
  }
}
