'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('healthhubUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    window.localStorage.setItem('healthhubUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('healthhubUser');
  };

  const getUser = () => {
    const userDetails = window.localStorage.getItem('healthhubUser');
    return JSON.parse(userDetails);
  };

  const refreshToken = useCallback(async () => {
    const currentUser = user || getUser();

    if (!currentUser) return;

    try {
      const response = await authService.refreshAccessToken();
      if (response.status === 200) {
        const updatedUser = {
          ...currentUser,
          accessToken: response.data.accessToken
        };
        setUser(updatedUser);
        window.localStorage.setItem(
          'healthhubUser',
          JSON.stringify(updatedUser)
        );
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, getUser, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
