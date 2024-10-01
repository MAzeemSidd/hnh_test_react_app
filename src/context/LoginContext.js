import React, { createContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false)
  const [userData, setUserData] = useState(null)

  const loginUser = (data) => {
    setLoginStatus(true)
    setUserData(data)
  }

  const logoutUser = () => {
    setLoginStatus(false)
    setUserData(null)
  }

  return (
    <AuthContext.Provider value={{ loginStatus, userData, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
