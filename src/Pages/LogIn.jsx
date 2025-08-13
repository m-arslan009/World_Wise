import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import PageNav from "../Components/PageNav";
import styles from "../Css Modules/CommonProperties.module.css";
import formStyles from "../Css Modules/LogIn.module.css";
import { useAuth } from "../Context/FakeAuthContext";

export default function LogIn() {
  const { login, error, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login(username, password);
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`${styles.dimensions} ${styles.container}`}>
      <PageNav />
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />

        {error && <p className={formStyles.error}>{error}</p>}

        <button
          type="submit"
          disabled={error}
          style={{
            opacity: isAuthenticated ? 0.7 : 1,
            cursor: isAuthenticated ? "not-allowed" : "pointer",
          }}
        >
          {isAuthenticated ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
