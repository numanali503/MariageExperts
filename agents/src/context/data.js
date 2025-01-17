import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authURL = `http://localhost:6969/api/auth`;
  // const authURL = `https://marriage.bzsconnect.com/api/auth`
  return (
    <AuthContext.Provider value={{ authURL }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
