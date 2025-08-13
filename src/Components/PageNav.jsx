// import { Link, NavLink } from "react-router";
import { Link, NavLink } from "react-router"; // we can use Link as well but NavLink gives a class to that link that curently visited but not Link do this
import logo from "../assets/logo.png";
import Style from "../Css Modules/PageNav.module.css";
import CommonStyles from "../Css Modules/CommonProperties.module.css";

export default function PageNav() {
  return (
    <nav className={Style.nav}>
      <NavLink to="/" className={CommonStyles.logo}>
        <img src={logo} alt="WorldWise Logo" />
        <h2>WorldWise</h2>
      </NavLink>
      <ul>
        <NavLink to="/Products">
          <li>Products</li>
        </NavLink>

        <NavLink to="/pricing">
          <li>Pricing</li>
        </NavLink>

        <Link to="/login">
          <button className={CommonStyles.button}>Login</button>
        </Link>
      </ul>
    </nav>
  );
}
