"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, clearToken, getToken, setToken, User } from './api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  const token = getToken();
  const storedUser = localStorage.getItem('user');
  if (token && storedUser) {
    return JSON.parse(storedUser) as User;
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
