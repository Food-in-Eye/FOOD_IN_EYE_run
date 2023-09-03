import React, { createContext, useContext, useState } from "react";
import { startTokenRefresh, stopTokenRefresh } from "./TokenRefreshService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const login = () => {
    setLoggedIn(true);
    startTokenRefresh();
  };

  const logout = () => {
    setIsLoggingOut(true);
    setLoggedIn(false);
    stopTokenRefresh();

    localStorage.removeItem("u_id");
    localStorage.removeItem("s_id");
    localStorage.removeItem("a_token");
    localStorage.removeItem("r_token");
    localStorage.removeItem("r_token_create_time");
    localStorage.removeItem("storeNum");

    setTimeout(() => {
      setLoggedIn(false);
      setIsLoggingOut(false);
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
