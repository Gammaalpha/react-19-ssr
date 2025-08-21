import { ReactNode } from "react";

export interface IAuthProvider {
  children: ReactNode;
}

export interface User {
  id: number;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterCredentials extends LoginCredentials {}
