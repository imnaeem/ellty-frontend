'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/generated/graphql';
import Cookies from 'js-cookie';

type AuthUser = Omit<User, 'password'>;

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in cookies
    const savedToken = Cookies.get('auth_token');
    const savedUser = Cookies.get('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Error parsing saved user data, clean up cookies
        Cookies.remove('auth_token');
        Cookies.remove('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: AuthUser) => {
    setToken(newToken);
    setUser(userData);
    
    // Save to cookies (expires in 24 hours)
    Cookies.set('auth_token', newToken, { expires: 1 });
    Cookies.set('auth_user', JSON.stringify(userData), { expires: 1 });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Remove from cookies
    Cookies.remove('auth_token');
    Cookies.remove('auth_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
