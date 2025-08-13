import Styles from "../Css Modules/LogOut.module.css";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/FakeAuthContext";

export default function LogOut() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogOut() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className={Styles.container}>
      {user && (
        <>
          <img src={user.avatar} />
          <h3>{user.name}</h3>
          <button onClick={handleLogOut}>Log Out</button>
        </>
      )}
    </div>
  );
}
