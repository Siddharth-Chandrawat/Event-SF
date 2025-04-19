import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // on load, check if token is stored
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, role: decoded.role });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  
  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const { accessToken, user } = res.data;
  
    localStorage.setItem("token", accessToken); // authorisation ke liye
    localStorage.setItem("user", JSON.stringify(user)); //UI ke liye
    setUser(user);
  };
   

  const register = async (email, password, role) => {
    try {
      const res = await registerUser(email, password, role);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
    } catch (err) {
      const msg = err.response?.data?.msg || err.message; //agar response mein error hua to varna normally
      throw new Error(msg);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
