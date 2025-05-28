import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../models/Interfaces";
import { IAuthProvider } from "../models/Interfaces";
import { redirect } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; accessToken: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
};

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const apiCall = async (url: string, options: any) => {
    const response = await fetch(`/api${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: "LOGIN_START" });
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.user, accessToken: data.accessToken },
      });
      redirect("/dashboard");
      return true;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      return false;
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<boolean> => {
    try {
      dispatch({ type: "LOGIN_START" });
      const data = await apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.user, accessToken: data.accessToken },
      });

      return true;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiCall("/auth/logout", {
        method: "POST",
        headers: {
          authorization: state.accessToken,
        },
      });
      redirect("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const data = await apiCall("/auth/refresh", { method: "POST" });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.user, accessToken: data.accessToken },
      });
      return true;
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshToken();
      } catch (error) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
