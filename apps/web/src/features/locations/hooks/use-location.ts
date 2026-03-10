import { useQuery } from "@tanstack/react-query";
import { fetchLocation } from "../api/locations.api";

export function useLocation(id: string) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: () => fetchLocation(id),
    enabled: Boolean(id),
  });
}
