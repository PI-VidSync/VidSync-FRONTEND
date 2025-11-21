import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { email: string; firstName?: string; lastName?: string; age?: string | number } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<{ email: string; firstName: string; lastName: string; age: string | number }>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "vidsync_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // En un proyecto real validar token con backend. Aquí asumimos válido.
      setUser({ email: "user@local" });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Aquí pondrías la llamada real a la API. Simulamos éxito si hay texto.
    if (email && password) {
      const fakeToken = "fake-jwt-token";
      localStorage.setItem(TOKEN_KEY, fakeToken);
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = (data: Partial<{ email: string; firstName: string; lastName: string; age: string | number }>) => {
    setUser((prev) => {
      if (!prev) return { email: data.email ?? "user@local", ...data };
      return { ...prev, ...data } as typeof prev;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
