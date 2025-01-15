import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
    
    if ((username === "admin" && password === "admin") || 
        (username === "staff" && password === "staff")) {
      toast({
        title: "Welcome back! 👋",
        description: "Successfully logged in",
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Try admin/admin or staff/staff",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-lg bg-white/80 backdrop-blur-sm rounded-[2rem] border-none">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-white/50 border-muted h-12 rounded-2xl"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/70" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/50 border-muted h-12 rounded-2xl"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-primary hover:opacity-90 transition-opacity rounded-2xl"
          >
            Sign In
          </Button>
        </form>

        <div className="text-sm text-center text-muted-foreground">
          Demo credentials:<br />
          Admin: admin/admin<br />
          Staff: staff/staff
        </div>
      </Card>
    </div>
  );
};

export default Login;