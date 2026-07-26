import { createContext, useState, useEffect } from "react";
import api from "../services/api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("studybuddy_user");
    const token = localStorage.getItem("studybuddy_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    const { token, ...userData } = data;
    localStorage.setItem("studybuddy_token", token);
    localStorage.setItem("studybuddy_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("studybuddy_token");
    localStorage.removeItem("studybuddy_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
