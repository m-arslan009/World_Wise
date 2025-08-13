import { useEffect, useState } from "react";

export function useGeoLocation() {
  const [defaultLocation, setDefaultLocation] = useState({
    lat: null,
    lng: null,
  });

  const [fetchLocation, setFetchLocation] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setFetchLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setFetchError("Geolocation is not supported by this browser.");
    }
    setFetchLocation(false);
  }, []);

  return { defaultLocation, fetchLocation, fetchError };
}
