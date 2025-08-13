import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
} from "react";

import { useFlagLoader } from "../hooks/useFlagLoader";
import { useLocationFetcher } from "../hooks/useLocationFetcher";

const CityData = createContext();

const initialState = {
  visitedCitiesArr: [],
  countries: [],
  visitedlocation: [{ lat: null, lng: null }],
  citiesData: [],
  isCity: true,
  currLocation: { lat: 51.505, lng: -0.09 },
  currentCity: null,
  locationWantToVisit: { lat: null, lng: null },
};

function reducer(state, action) {
  switch (action.type) {
    case "RESET": {
      return { initialState };
    }
    case "ADD_LOCATION":
      return {
        ...state,
        visitedCitiesArr: [...state.visitedCitiesArr, action.payload],
      };

    case "SET_LOCATION":
      return {
        ...state,
        currentCity: {
          ...state.currentCity,
          position: action.payload,
        },
        locationWantToVisit: {
          lat: action.payload.lat,
          lng: action.payload.lng,
        },
      };

    case "SET_CURRENT_LOCATION":
      return {
        ...state,
        currLocation: action.payload,
      };

    case "SET_CITY":
      return {
        ...state,
        locationWantToAdd: {
          ...state.locationWantToAdd,
          cityName: action.payload.cityName,
          country: action.payload.country,
        },
      };
    case "SET_COUNTRIES":
      return {
        ...state,
        countries: { ...state.countries, ...action.payload },
      };

    case "SET_IS_CITY":
      return {
        ...state,
        isCity: action.payload,
      };

    case "SET_CITIES_DATA":
      return {
        ...state,
        citiesData: action.payload,
      };

    case "SELECT_CITY": {
      return {
        ...state,
        currentCity: state.visitedCitiesArr.find(
          (city) => city.id === action.payload
        ),
      };
    }

    case "DELETE_CITY": {
      const updatedCities = state.visitedCitiesArr.filter(
        (city) => city.id !== action.payload
      );

      const newCurrentCity =
        state.currentCity?.id === action.payload ? null : state.currentCity;

      return {
        ...state,
        visitedCitiesArr: updatedCities,
        currentCity: newCurrentCity,
      };
    }

    case "CLEAR_VISITED_CITIES":
      return {
        ...state,
        currentCity: null,
      };

    case "LOCATION_WANT_TO_VISIT":
      return {
        ...state,
        locationWantToVisit: action.payload,
      };

    default:
      return state;
  }
}

function CityDataProvider({ children }) {
  const [
    {
      citiesData,
      currLocation,
      visitedCitiesArr,
      currentCity,
      locationWantToVisit,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [countriesFlag, setCountriesFlag] = useState({});

  const { newLocation, LocationFetchLoading, LocationFetchError } =
    useLocationFetcher(currLocation);

  const { loadingFlags, errorFlagFetching } = useFlagLoader({
    // citiesData,
    visitedCitiesArr,
    setCountriesFlag,
    countriesFlag,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/Cities");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        dispatch({ type: "SET_CITIES_DATA", payload: data });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <CityData.Provider
      value={{
        citiesData,
        visitedCitiesArr,
        dispatch,
        loading,
        error,
        currLocation,
        countriesFlag,
        loadingFlags,
        errorFlagFetching,
        currentCity,
        newLocation,
        LocationFetchLoading,
        LocationFetchError,
        locationWantToVisit,
      }}
    >
      {children}
    </CityData.Provider>
  );
}

function useCityData() {
  const context = useContext(CityData);
  if (context === undefined || context === null) {
    throw new Error(
      "useCityData must be used within a CityDataContextProvider"
    );
  }
  return context;
}

export { CityDataProvider, useCityData };
