export const LOCATION_STATUS = ["ACTIVE", "INACTIVE"] as const;
export type LocationStatus = (typeof LOCATION_STATUS)[number];

export type LocationRow = {
  id: string;
  name: string;
  address: string;
  photoUrl?: string | null;
  mapsUrl?: string | null;
  embedUrl?: string | null;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
};

export type LocationCreateValues = {
  name: string;
  address: string;
  photoUrl?: string | null;
  mapsUrl?: string | null;
  embedUrl?: string | null;
  status?: LocationStatus;
};

export type LocationUpdateValues = {
  name?: string;
  address?: string;
  photoUrl?: string | null;
  mapsUrl?: string | null;
  embedUrl?: string | null;
  status?: LocationStatus;
};
