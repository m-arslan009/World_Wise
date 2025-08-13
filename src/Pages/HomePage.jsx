import { NavLink } from "react-router";
import PageNav from "../Components/PageNav";
import HomeStyle from "../Css Modules/HomePage.module.css";
import CommonStyles from "../Css Modules/CommonProperties.module.css";

export default function HomePage() {
  return (
    <div className={HomeStyle.container}>
      <PageNav />
      <div className={HomeStyle.content_container}>
        <h1>You travel the world.</h1>
        <h1>WorldWise keeps track of your adventures.</h1>
        <p>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world
        </p>
        <NavLink to="/login">
          <button className={CommonStyles.button}>START TRACKING NOW</button>
        </NavLink>
      </div>
    </div>
  );
}
