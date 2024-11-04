import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/check-session', { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(true);
        setUser(response.data.user);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = async () => {
    await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;