import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)

  const loginUser = (data) => {
    localStorage.setItem('auth', JSON.stringify({data: data}));
    setUserData(data)
  }

  const logoutUser = () => {
    localStorage.removeItem('auth');
    setUserData(null)
  }

  // Initialize authentication state from localStorage on mount
//   useEffect(() => {
//     const authData = JSON.parse(localStorage.getItem('auth'));
//     if (authData && authData.status) {
//       setUserData(authData.data);
//     }
//   }, []); // Empty dependency array ensures this runs once on mount

  return (
    <AuthContext.Provider value={{ userData, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
