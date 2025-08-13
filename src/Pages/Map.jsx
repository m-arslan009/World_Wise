import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCityData } from "../Context/CityDataContext";
import MapTypeSelector from "../Components/MapTypeSelector";
import Styles from "../Css Modules/Map.module.css";
import Button from "../Components/Button";
import { useGeoLocation } from "../hooks/useGeoLocation";
import L from "leaflet";

// Fix for default markers not showing in production
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icon for better deployment compatibility
const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fallback icon using CDN for production environments
const fallbackMarkerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Use custom icon, fallback to CDN if needed
const markerIconToUse = customMarkerIcon;

function HandleClick({ navigate, dispatch }) {
  const map = useMap();

  useMapEvents({
    click: (e) => {
      // Clear any current city selection to prevent unwanted map movement
      dispatch({ type: "SELECT_CITY", payload: null });

      dispatch({
        type: "LOCATION_WANT_TO_VISIT",
        payload: { lat: e.latlng.lat, lng: e.latlng.lng },
      });

      // Zoom to level 13 when clicking to add a new location
      map.setView([e.latlng.lat, e.latlng.lng], 13, {
        animate: true,
        duration: 1.0,
      });

      // Navigate to form
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}

function ChangeCenter({ position, shouldChange }) {
  const map = useMap();

  useEffect(() => {
    // Only change center when explicitly requested
    if (shouldChange && position && position[0] && position[1]) {
      const currentCenter = map.getCenter();
      const currentPosition = [currentCenter.lat, currentCenter.lng];
      const distance = map.distance(currentPosition, position);

      const duration = distance > 10000 ? 3.0 : 1.0;
      const easeLinearity = distance > 10000 ? 0.1 : 0.3;

      map.flyTo(position, 13, {
        animate: true,
        duration: duration,
        easeLinearity: easeLinearity,
      });
    }
  }, [map, position, shouldChange]);

  return null;
}

export default function Map() {
  const { dispatch, currentCity, locationWantToVisit, visitedCitiesArr } =
    useCityData();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [currentMapType, setCurrentMapType] = useState("street");

  const { defaultLocation, isLoading: geoLoading } = useGeoLocation();

  // Map center: use current location if available, otherwise fallback to London
  const mapInitialCenter =
    defaultLocation?.lat && defaultLocation?.lng
      ? [defaultLocation.lat, defaultLocation.lng]
      : [51.505, -0.09];

  // Calculate positions for animation
  const selectedCityPosition = currentCity
    ? [currentCity.position.lat, currentCity.position.lng]
    : null;

  const currentLocationPosition =
    defaultLocation?.lat && defaultLocation?.lng
      ? [defaultLocation.lat, defaultLocation.lng]
      : null;

  const handleMapTypeChange = (mapType) => {
    setCurrentMapType(mapType);
  };

  // State for managing when to move to current location
  const [shouldMoveToCurrentLocation, setShouldMoveToCurrentLocation] =
    useState(false);

  // State for managing when to animate to selected city
  const [shouldMoveToSelectedCity, setShouldMoveToSelectedCity] =
    useState(false);

  useEffect(() => {
    if (currentCity) {
      setShouldMoveToCurrentLocation(false);
      setShouldMoveToSelectedCity(true);
    }
  }, [currentCity]);

  // Clear currentCity when navigating to add form to prevent unwanted map movement
  useEffect(() => {
    if (locationWantToVisit?.lat && locationWantToVisit?.lng) {
      dispatch({ type: "SELECT_CITY", payload: null });
    }
  }, [locationWantToVisit, dispatch]);

  // Reset city animation flag after animation
  useEffect(() => {
    if (shouldMoveToSelectedCity) {
      const timer = setTimeout(() => {
        setShouldMoveToSelectedCity(false);
      }, 3000); // Reset after animation duration
      return () => clearTimeout(timer);
    }
  }, [shouldMoveToSelectedCity]);

  function handlePositionClick() {
    if (geoLoading || !defaultLocation?.lat || !defaultLocation?.lng) {
      return;
    }

    setIsLoading(true);
    dispatch({ type: "CLEAR_VISITED_CITIES" });
    setShouldMoveToCurrentLocation(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div style={{ position: "relative" }} className={Styles.map_container}>
      <MapTypeSelector
        currentMapType={currentMapType}
        onMapTypeChange={handleMapTypeChange}
      />

      <Button
        type="position"
        onClick={handlePositionClick}
        disabled={geoLoading}
      >
        {geoLoading
          ? "Getting Location..."
          : isLoading
          ? "Moving..."
          : "Use My Location"}
      </Button>

      <MapContainer
        center={mapInitialCenter}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        {getTileLayer(currentMapType)}

        {/* Animate to selected visited city when clicking on a city from sidebar */}
        <ChangeCenter
          position={selectedCityPosition}
          shouldChange={shouldMoveToSelectedCity}
        />

        {/* Animate to user's current location when "Use My Location" button is clicked */}
        <ChangeCenter
          position={currentLocationPosition}
          shouldChange={shouldMoveToCurrentLocation}
        />

        {/* Temporary marker for location clicked on map (before adding to cities) */}
        {locationWantToVisit?.lat && locationWantToVisit?.lng && (
          <Marker
            position={[locationWantToVisit.lat, locationWantToVisit.lng]}
            icon={markerIconToUse}
          >
            <Popup>
              <strong>📍 New Location to Add</strong>
              <br />
              Click "Add" in the form to save this location
            </Popup>
          </Marker>
        )}

        {/* User's current location marker (shown when "Use My Location" is clicked) */}
        {shouldMoveToCurrentLocation && defaultLocation && !currentCity && (
          <Marker
            position={[defaultLocation.lat, defaultLocation.lng]}
            icon={markerIconToUse}
          >
            <Popup className={Styles.map_popup}>
              <strong>📍 Your Current Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Currently selected visited city marker (highlighted from sidebar) */}
        {currentCity && (
          <Marker
            position={[currentCity.position.lat, currentCity.position.lng]}
            icon={markerIconToUse}
          >
            <Popup>
              <strong>{currentCity.cityName}</strong>
              <br />
              {currentCity.date}
              <br />
              <em>{currentCity.notes}</em>
            </Popup>
          </Marker>
        )}

        {/* All other visited cities markers (excluding the currently selected one) */}
        {visitedCitiesArr.length > 0 &&
          visitedCitiesArr
            .filter((city) => !currentCity || city.id !== currentCity.id)
            .map((city) => (
              <Marker
                key={`${city.id}-${visitedCitiesArr.length}`}
                position={[city.position.lat, city.position.lng]}
                icon={markerIconToUse}
              >
                <Popup>
                  <strong>
                    {city.cityName} ({city.country})
                  </strong>
                  <br />
                  {city.date}
                  <br />
                  <em>{city.notes}</em>
                </Popup>
              </Marker>
            ))}

        <HandleClick navigate={navigate} dispatch={dispatch} />
      </MapContainer>
    </div>
  );
}

const getTileLayer = (currentMapType) => {
  switch (currentMapType) {
    case "satellite":
      return (
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        />
      );
    case "hybrid":
      return (
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        />
      );
    case "terrain":
      return (
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        />
      );
    case "street":
    default:
      return (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      );
  }
};
