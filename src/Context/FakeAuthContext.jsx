import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  avatar: `https://i.pravatar.cc/50?img=${Math.floor(Math.random() * 70)}`,
};

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    // Clear any previous errors
    dispatch({ type: "SET_ERROR", payload: null });

    // Check if credentials match (allow both email and "admin" as username)
    if (
      (email === FAKE_USER.email || email === "admin") &&
      password === FAKE_USER.password
    ) {
      dispatch({ type: "LOGIN", payload: FAKE_USER });
    } else {
      dispatch({ type: "SET_ERROR", payload: "Invalid email or password" });
    }
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("AuthContext use outside AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
