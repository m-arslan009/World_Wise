import { useCityData } from "../Context/CityDataContext";
import styles from "../Css Modules/Countires.module.css";
import CountryItem from "../Components/CountryItem";
import Spinner from "../Components/Spinner";
import Error from "../Components/Error";
import Empty from "../Components/Empty";

// import { useFlagLoader } from "../hooks/useFlagLoader";

export default function Countries() {
  const {
    countriesFlag,
    // citiesData,
    visitedCitiesArr,
    loading,
    error,
    loadingFlags,
    errorFlagFetching,
  } = useCityData();

  // Combined loading state
  const isLoading = loading || loadingFlags;
  const combinedError = error || errorFlagFetching;

  if (isLoading) return <Spinner />;

  if (combinedError) return <Error error={combinedError} />;

  if (visitedCitiesArr.length === 0) {
    return <Empty />;
  }

  const uniqueCountries = [
    ...new Set(visitedCitiesArr.map((city) => city.country)),
  ];

  const countriesContainer = uniqueCountries.map((country) => {
    return (
      <CountryItem
        key={country}
        country={country}
        imageUrl={countriesFlag[country]}
      />
    );
  });

  return <div className={styles.container}>{countriesContainer}</div>;
}
