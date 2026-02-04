import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export type Role = 'ADMIN' | 'PARTICIPANT';

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  id: string;
  email: string;
  role: Role;
  token: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELED';
  reservedCount?: number;
}

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'REFUSED' | 'CANCELED';
  createdAt: string;
  event?: Event;
  user?: User;
}
