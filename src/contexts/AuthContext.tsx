import React, { createContext, useContext, useState } from "react";

type UserRole = "staff" | "admin";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    // Simple credential check for demo
    if (username === "admin" && password === "admin") {
      setUser({
        id: "1",
        name: "Admin User",
        role: "admin",
      });
    } else if (username === "staff" && password === "staff") {
      setUser({
        id: "2",
        name: "Staff User",
        role: "staff",
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}