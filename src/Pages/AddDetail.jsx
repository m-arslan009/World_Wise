import Style from "../Css Modules/AddDetail.module.css";
import { useNavigate } from "react-router";
import Button from "../Components/Button";
import { useURLPosition } from "../hooks/useURLPosition";
import { useEffect, useState } from "react";
import { useCityData } from "../Context/CityDataContext";
import { nanoid } from "nanoid";

export default function AddDetail() {
  const navigate = useNavigate();
  const { dispatch } = useCityData();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [town, setTown] = useState("");
  const [error, setError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const { lat, lng } = useURLPosition();

  function handleDate(e) {
    setDate(e.target.value);
  }

  function handleNote(e) {
    setNote(e.target.value);
  }

  useEffect(() => {
    // Don't fetch data if coordinates are missing
    if (!lat || !lng) {
      setError(
        "No location coordinates provided. Please click on the map first."
      );
      return;
    }

    async function getData() {
      setLoadingLocation(true);
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const data = await response.json();

        if (!data.city) {
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 🙂"
          );
        }

        console.log(data);
        setCityName(data.city || data.locality || "");
        setTown(data.locality || "");
        setCountry(data.countryName || "");
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Location fetch error:", error);
        setError(error.message);
        setCityName("");
        setTown("");
        setCountry("");
      } finally {
        setLoadingLocation(false);
      }
    }
    getData();
  }, [lat, lng]);

  // Show error without spinner, just return error message
  if (error)
    return (
      <div
        style={{
          color: `var(--color--light-1)`,
          background: `var(--color-dark--2)`,
          padding: "1rem",
          borderRadius: "5px",
          margin: "1rem",
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );

  function handleSubmit(e) {
    e.preventDefault();

    // Validate required fields
    if (!cityName && !town) {
      setError("Please select a valid location with a city name");
      return;
    }

    if (!date) {
      setError("Please enter a date for your visit");
      return;
    }

    // Clear any previous errors
    setError("");

    try {
      dispatch({
        type: "ADD_LOCATION",
        payload: {
          id: nanoid(),
          cityName: cityName || town,
          country: country,
          date: date,
          notes: note,
          position: { lat: lat, lng: lng },
        },
      });

      // Clear location selections after successful add
      dispatch({
        type: "LOCATION_WANT_TO_VISIT",
        payload: { lat: null, lng: null },
      });
      dispatch({ type: "SELECT_CITY", payload: null });

      navigate("/app/cities");
    } catch (error) {
      console.error("Error adding location:", error);
      setError("Failed to add location. Please try again.");
    }
  }

  return (
    <form className={Style.container} onSubmit={handleSubmit}>
      <div className={Style.input_container}>
        <label htmlFor="cityName">City Name:</label>
        <input
          type="text"
          id="cityName"
          placeholder={loadingLocation ? "Loading..." : "City name"}
          value={cityName || ""}
          readOnly
          style={{
            opacity: loadingLocation ? 0.6 : 1,
            background: loadingLocation ? "#f0f0f0" : "white",
          }}
        />
      </div>

      <div className={Style.input_container}>
        <label htmlFor="town">Town/Locality:</label>
        <input
          type="text"
          id="town"
          placeholder={loadingLocation ? "Loading..." : "Town or locality"}
          value={town || ""}
          readOnly
          style={{
            opacity: loadingLocation ? 0.6 : 1,
            background: loadingLocation ? "#f0f0f0" : "white",
          }}
        />
      </div>

      <div className={Style.input_container}>
        <label htmlFor="date">When you want to visit:</label>
        <input
          type="text"
          id="date"
          placeholder="Enter visiting date"
          min={new Date().toISOString().split("T")[0]}
          onChange={handleDate}
        />
      </div>

      <div className={Style.input_container}>
        <label htmlFor="date">Note About Your Trip to (City Name):</label>
        <textarea
          id="note"
          placeholder="Write your note here"
          rows="4"
          cols="20"
          onChange={handleNote}
        />
      </div>
      <div className={Style.button_container}>
        <button type="submit" className={Style.primaryButton}>
          Add
        </button>
        <Button
          type={"back"}
          onClick={(e) => {
            e.preventDefault();
            // Clear the location want to visit and current city selection
            dispatch({
              type: "LOCATION_WANT_TO_VISIT",
              payload: { lat: null, lng: null },
            });
            dispatch({ type: "SELECT_CITY", payload: null });
            navigate("/app");
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}
