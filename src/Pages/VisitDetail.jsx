// import { useParams, useSearchParams } from "react-router";
import Style from "../Css Modules/VisitDetail.module.css";
import { useNavigate } from "react-router";
import Button from "../Components/Button";
import { useCityData } from "../Context/CityDataContext";

export default function VisitDetail() {
  const { currentCity, countriesFlag } = useCityData();

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/app/cities");
  };

  if (!currentCity) {
    return;
  }

  return (
    <section className={Style.container}>
      <div className={Style.cityInfo}>
        <p>City Name</p>
        <div>
          <img
            src={countriesFlag[currentCity?.country]}
            alt={`${currentCity?.cityName} flag`}
          />
          <h3>{currentCity?.cityName}</h3>
        </div>
      </div>
      <div>
        <p>You went to the {currentCity?.country}</p>
        <h3>{currentCity?.date}</h3>
      </div>
      <div>
        <p>Your Note</p>
        <h3>{currentCity.notes}</h3>
      </div>
      <div>
        <p>Learn more</p>
        <a
          href={`https://en.wikipedia.org/wiki/${currentCity?.country}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out {currentCity?.country} on Wikipedia →
        </a>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button onClick={handleBackClick} type="back">
          &larr; Back
        </Button>
      </div>
    </section>
  );
}
