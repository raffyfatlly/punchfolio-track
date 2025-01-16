import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "staff" | "admin";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state from localStorage on component mount
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username: string, password: string, role: UserRole) => {
    if (password === "staff123") {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: username,
        role: role,
      };
      setUser(newUser);
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem("user");
  };

  // Effect to sync localStorage with state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

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