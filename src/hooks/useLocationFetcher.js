import { useState, useEffect } from "react";

export function useLocationFetcher({ location = null }) {
  const [newLocation, setNewLocation] = useState({});
  const [LocationFetchLoading, setLoading] = useState(false);
  const [LocationFetchError, setError] = useState(null);

  useEffect(() => {
    async function getLocation() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse/?lat=${location.lat}&lon=${location.lng}&format=json&addressdetail=1`
        );
        const data = await res.json();
        if (data.response === false) {
          throw new Error("Location not found");
        }
        setNewLocation({
          cityName:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          country: data.address.country || "",
          position: { lat: location.lat, lng: location.lng },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getLocation();
  }, [location]);

  return { newLocation, LocationFetchLoading, LocationFetchError };
}
