import { useEffect, useState } from "react";

// Country name mappings for common variations
const COUNTRY_NAME_MAPPINGS = {
  "United States": "United States of America",
  USA: "United States of America",
  UK: "United Kingdom",
  "Great Britain": "United Kingdom",
  Britain: "United Kingdom",
  England: "United Kingdom",
  Scotland: "United Kingdom",
  Wales: "United Kingdom",
  "Northern Ireland": "United Kingdom",
  "United Kingdom of Great Britain and Northern Ireland (the)":
    "United Kingdom",
  "United Kingdom of Great Britain and Northern Ireland": "United Kingdom",
  Russia: "Russian Federation",
  "South Korea": "Korea (Republic of)",
  "North Korea": "Korea (Democratic People's Republic of)",
  "Czech Republic": "Czechia",
  Macedonia: "North Macedonia",
  Myanmar: "Myanmar",
  Burma: "Myanmar",
  Iran: "Iran (Islamic Republic of)",
  Syria: "Syrian Arab Republic",
  Venezuela: "Venezuela (Bolivarian Republic of)",
  Bolivia: "Bolivia (Plurinational State of)",
  Tanzania: "Tanzania, United Republic of",
  Moldova: "Moldova (Republic of)",
  Congo: "Congo (Democratic Republic of the)",
  "Ivory Coast": "Côte d'Ivoire",
  "Cape Verde": "Cabo Verde",
};

async function getFlag(countryName) {
  try {
    // Try the original name first
    let searchName = countryName;

    // Check if we have a mapping for this country name
    if (COUNTRY_NAME_MAPPINGS[countryName]) {
      searchName = COUNTRY_NAME_MAPPINGS[countryName];
    }

    let res = await fetch(
      `https://restcountries.com/v3.1/name/${searchName}?fullText=true`
    );

    // If first attempt fails, try with partial matching
    if (!res.ok) {
      res = await fetch(`https://restcountries.com/v3.1/name/${searchName}`);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch flag for ${countryName}`);
    }

    const data = await res.json();

    // Get the first result that matches
    const country = Array.isArray(data) ? data[0] : data;
    return country.flags.png;
  } catch (error) {
    console.error(`Error fetching flag for ${countryName}:`, error);
    return null;
  }
}

export function useFlagLoader({ visitedCitiesArr, setCountriesFlag }) {
  const [loadingFlags, setLoadingFlags] = useState(false);
  const [errorFlagFetching, setErrorFlagFetching] = useState(null);

  useEffect(() => {
    if (!visitedCitiesArr || visitedCitiesArr.length === 0) {
      return;
    }

    const fetchFlags = async () => {
      setLoadingFlags(true);
      setErrorFlagFetching(null);

      try {
        // Get unique countries to avoid duplicate API calls
        const uniqueCountries = [
          ...new Set(visitedCitiesArr.map((city) => city.country)),
        ];

        // Fetch all flags in parallel
        const flagPromises = uniqueCountries.map(async (country) => {
          const flagUrl = await getFlag(country);
          return { country, flagUrl };
        });

        // Wait for all promises to resolve
        const results = await Promise.all(flagPromises);

        // Convert array to object for easy lookup
        const flagsObject = {};
        results.forEach(({ country, flagUrl }) => {
          if (flagUrl) {
            flagsObject[country] = flagUrl;
          }
        });
        setCountriesFlag(flagsObject);
      } catch (err) {
        console.error("Error in fetchFlags:", err);
        setErrorFlagFetching(err.message);
      } finally {
        setLoadingFlags(false);
      }
    };

    fetchFlags();
  }, [visitedCitiesArr, setCountriesFlag]);

  return { loadingFlags, errorFlagFetching };
}
