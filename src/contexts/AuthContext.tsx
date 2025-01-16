import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type UserRole = "staff" | "admin";

interface User {
  id: number;  // This is correctly typed as number to match profiles table
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // When session changes, fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setUser({
            id: data.id,  // Now correctly typed as number
            name: data.name,
            role: data.role as UserRole,
          });
        }
      } else {
        setUser(null);
      }
    }

    fetchUserProfile();
  }, [session]);

  const login = async (username: string, password: string, role: UserRole) => {
    try {
      console.log('Attempting login for:', username);
      
      // For demo purposes, just set the user directly without Supabase auth
      if (password === "staff123") {
        const { data: selectedStaff, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('name', username)
          .single();

        if (error) {
          console.error('Error fetching staff:', error);
          toast({
            title: "Login Error",
            description: "Failed to find staff member",
            variant: "destructive",
          });
          throw new Error("Failed to find staff member");
        }

        if (selectedStaff) {
          console.log('Found staff member:', selectedStaff);
          setUser({
            id: selectedStaff.id,  // This is now correctly a number from the database
            name: username,
            role: role,
          });
          toast({
            title: "Success",
            description: "Successfully logged in",
          });
        }
      } else {
        toast({
          title: "Login Error",
          description: "Invalid password",
          variant: "destructive",
        });
        throw new Error("Invalid password");
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "Successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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