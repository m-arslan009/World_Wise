import Map from "./Map";
import AppLayoutStyling from "../Css Modules/AppLayout.module.css";
import AppNav from "../Components/AppNav";
import { NavLink, Outlet } from "react-router";
import { useCityData } from "../Context/CityDataContext";
import LogOut from "../Components/LogOut";

export default function AppLayout() {
  const { errorFlagFetching } = useCityData();
  if (errorFlagFetching) return <Error error={errorFlagFetching} />;
  return (
    <div className={AppLayoutStyling.container}>
      <LogOut />
      <div className={AppLayoutStyling.sidebar}>
        <AppNav />
        <div className={AppLayoutStyling.btn_container}>
          <ul>
            <li>
              <NavLink to="cities">Cities</NavLink>
            </li>
            <li>
              <NavLink to="countries">Countries</NavLink>
            </li>
          </ul>
        </div>
        <Outlet />
      </div>
      <div className={AppLayoutStyling.map}>
        <Map />
      </div>
    </div>
  );
}
