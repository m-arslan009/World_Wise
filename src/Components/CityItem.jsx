import { Link } from "react-router";
import Styles from "../Css Modules/CityItem.module.css";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function CityItem({
  city,
  isSelected,
  flagImageURL,
  dispatch,
  onClick,
}) {
  return (
    <div
      style={{ width: "100%" }}
      className={`${Styles.cityItem} ${isSelected ? Styles.selected : ""}`}
    >
      <Link
        className={Styles.cityItemContainer}
        to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
        onClick={onClick}
      >
        <div className={Styles.cityBox}>
          <div>
            <img src={flagImageURL} alt={`${city.country} flag`} />
            <span>{city.cityName}</span>
          </div>
          <span>({formatDate(city.date)}) </span>{" "}
        </div>
      </Link>
      <button
        className={Styles.deleteButton}
        onClick={() => dispatch({ type: "DELETE_CITY", payload: city.id })}
      >
        X
      </button>
    </div>
  );
}
