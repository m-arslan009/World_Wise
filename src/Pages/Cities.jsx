import CityItem from "../Components/CityItem";
import Spinner from "../Components/Spinner";
import Styles from "../Css Modules/City.module.css";
import Error from "../Components/Error";
import Empty from "../Components/Empty";
import { useCityData } from "../Context/CityDataContext";

export default function Cities() {
  // const { citiesData, loading, error, dispatch, currentCity, countriesFlag } =
  const {
    visitedCitiesArr,
    loading,
    error,
    dispatch,
    currentCity,
    countriesFlag,
  } = useCityData();

  console.log(visitedCitiesArr);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Error />;
  }

  if (!visitedCitiesArr.length) {
    return <Empty />;
  }

  const cities = visitedCitiesArr.map((city, idx) => {
    return (
      <>
        <CityItem
          key={idx}
          city={city}
          dispatch={dispatch}
          isSelected={currentCity?.id === city.id}
          flagImageURL={countriesFlag[city.country]}
          onClick={() => {
            dispatch({ type: "SELECT_CITY", payload: city.id });
          }}
        />
      </>
    );
  });

  return (
    <div style={{ marginBottom: "30px" }}>
      <div className={Styles.citiesList}>{cities}</div>
    </div>
  );
}
