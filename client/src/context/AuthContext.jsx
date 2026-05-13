import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    localStorage.setItem(
      "userInfo",
      JSON.stringify(data)
    );

    setUserInfo(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem(
      "userInfo",
      JSON.stringify(data)
    );

    setUserInfo(data);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};