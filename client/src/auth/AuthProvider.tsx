import { createContext, useState, useEffect } from "react";
import { User } from "../types/types";
import { API_URL } from "./constants";

interface IAuthContext {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (user: User, token: string, isAdmin: number) => void;
  logout: () => void;
  getIsAdmin: (isAdmin: number) => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  login: () => {},
  logout: () => {},
  getIsAdmin: () => {},
  loading: true,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getIsAdmin = (isAdmin: number) => {
    if (isAdmin === 1) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const login = (userData: User, token: string, isAdmin: number) => {
    setIsAuthenticated(true);
    setUser(userData);
    getIsAdmin(isAdmin);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.idUsuario;

    const fetchIsAdmin = async () => {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      };
      const response = await fetch(`${API_URL}/isAdmin/${userId}`, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      if (Array.isArray(data.body.isAdmin) && data.body.isAdmin.length > 0) {
        getIsAdmin(data.body.isAdmin[0].admin);
      } else {
        console.error("Invalid admin data received.");
      }
      setLoading(false);
    };

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
      fetchIsAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        login,
        logout,
        getIsAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
