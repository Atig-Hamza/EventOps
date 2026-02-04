"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, AuthResponse, clearToken, getToken, setToken, User } from './api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Basic restoration of user from token (decode or just assume logged in if token exists)
    // For simplicity, we might just check if token exists, 
    // but ideally we should save user info in localStorage too or fetch /me
    const token = getToken();
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    router.push(userData.role === 'ADMIN' ? '/admin' : '/dashboard');
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
