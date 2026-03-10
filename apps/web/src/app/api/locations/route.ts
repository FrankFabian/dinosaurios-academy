import { mapLocationToRow } from "@/features/locations/mappers";
import { createLocationDb, listLocationsDb } from "@/features/locations/repository";
import { createLocationSchema, zodErrorToResponse } from "@/features/locations/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const locations = await listLocationsDb();
  return NextResponse.json({ data: locations.map(mapLocationToRow) });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = createLocationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;

  try {
    const created = await createLocationDb({
      name: body.name.trim(),
      address: body.address.trim(),
      photoUrl: body.photoUrl ?? null,
      mapsUrl: body.mapsUrl ?? null,
      embedUrl: body.embedUrl ?? null,
      status: body.status ?? "ACTIVE",
    });

    return NextResponse.json({ data: mapLocationToRow(created) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Location already exists" }, { status: 409 });
    }

    throw error;
  }
}
