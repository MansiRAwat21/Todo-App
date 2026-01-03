import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types/Todos";
import api from "../services/api";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser();

    }
    setIsLoading(false);
  }, []);

const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };


  const loginToken = async(tokenValue: any) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
      await fetchUser(); 
  };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setToken(null);
  // };

  const logout = async () => {
  try {
    await api.post("/api/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    
  }
};


  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loginToken,
        user,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// export const useAuth = () => useContext(AuthContext);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};