import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const savedAuthToken = localStorage.getItem("token");
  let decodedToken = null;
  if (savedAuthToken) {
    decodedToken = jwtDecode(savedAuthToken);
  }

  const [user, setUser] = useState(decodedToken); // user object with role
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setToken(savedToken);
          setUser(decoded.user || decoded);
        }
      } catch (error) {
        logout(); // invalid token
      }

    }
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const expiresIn = decoded.exp * 1000 - Date.now();

      const timeout = setTimeout(()=>{
        logout();
        alert("Session expired. Please login again.");
      }, expiresIn);
      
      return () => clearTimeout(timeout);
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setToken(token);
    setUser(decoded.user || decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);