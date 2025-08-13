import { NavLink } from "react-router";
import CommonStyles from "../Css Modules/CommonProperties.module.css";
import logo from "../assets/logo.png";
import styles from "../Css Modules/AppNav.module.css";

export default function AppNav() {
  return (
    <nav className={`${CommonStyles.nav} ${styles.nav}`}>
      <NavLink to="/" className={CommonStyles.logo}>
        <img src={logo} alt="WorldWise Logo" />
        <h2 style={{ margin: 0, padding: 0 }}>WorldWise</h2>
      </NavLink>
    </nav>
  );
}
