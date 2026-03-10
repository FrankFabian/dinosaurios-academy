import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../api/locations.api";

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
}
