import Styles from "../Css Modules/CountryItem.module.css";

export default function CountryItem({ country, imageUrl }) {
  return (
    <div className={Styles.countryBox}>
      {imageUrl && <img src={imageUrl} alt={`${country.country} flag`} />}
      <span>{country}</span>
    </div>
  );
}
