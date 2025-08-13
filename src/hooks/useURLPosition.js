import { useSearchParams } from "react-router";

export function useURLPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat") || null;
  const lng = searchParams.get("lng") || null;
  console.log("Latitude:", lat);
  console.log("Longitude:", lng);
  return { lat, lng };
}
