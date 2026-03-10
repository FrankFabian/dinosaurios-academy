import type { Location } from "@prisma/client";
import type { LocationRow } from "./types";

export function mapLocationToRow(location: Location): LocationRow {
  return {
    id: location.id,
    name: location.name,
    address: location.address,
    photoUrl: location.photoUrl,
    mapsUrl: location.mapsUrl,
    embedUrl: location.embedUrl,
    status: location.status,
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString(),
  };
}
