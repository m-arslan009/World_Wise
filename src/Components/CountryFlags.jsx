import { useFlagLoader } from "../hooks/useFlagLoader";
import { citiesData } from "../data/citiesData";

export default function CountryFlags() {
  const { countriesFlag, loading, error } = useFlagLoader(citiesData);

  if (loading) {
    return <div>Loading country flags...</div>;
  }

  if (error) {
    return <div>Error loading flags: {error}</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
      }}
    >
      {Object.entries(countriesFlag).map(([country, flagUrl]) => (
        <div
          key={country}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <img
            src={flagUrl}
            alt={`${country} flag`}
            style={{ width: "30px", height: "20px", marginRight: "10px" }}
          />
          <span>{country}</span>
        </div>
      ))}
    </div>
  );
}
