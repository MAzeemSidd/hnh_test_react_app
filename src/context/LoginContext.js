import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false)
  const [userData, setUserData] = useState(null)

  const loginUser = (data) => {
    localStorage.setItem('auth', JSON.stringify({status: true, data: data}));
    setLoginStatus(true)
    setUserData(data)
  }

  const logoutUser = () => {
    localStorage.removeItem('auth');
    setLoginStatus(false)
    setUserData(null)
  }

  // Initialize authentication state from localStorage on mount
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    if (authData && authData.status) {
      setLoginStatus(true);
      setUserData(authData.data);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <AuthContext.Provider value={{ loginStatus, userData, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
