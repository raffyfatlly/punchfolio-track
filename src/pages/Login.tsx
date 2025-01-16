import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Staff {
  id: number;
  name: string;
  role: "staff" | "admin";
  department: string | null;
}

const Login = () => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [password, setPassword] = useState("");
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStaffList() {
      try {
        console.log('Fetching staff list...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, role, department');
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched staff:', data);

        if (!data) {
          console.log('No data returned from Supabase');
          setStaffList([]);
          toast({
            title: "No staff members",
            description: "No staff members found in the database",
            variant: "destructive",
          });
          return;
        }

        // Validate and transform the data to match the Staff interface
        const validatedStaffList: Staff[] = data.map(item => {
          // Ensure role is either "staff" or "admin"
          if (item.role !== "staff" && item.role !== "admin") {
            console.warn(`Invalid role "${item.role}" for user ${item.name}, defaulting to "staff"`);
            item.role = "staff";
          }
          
          return {
            id: item.id,
            name: item.name,
            role: item.role as "staff" | "admin",
            department: item.department
          };
        });

        setStaffList(validatedStaffList);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast({
          title: "Error",
          description: "Failed to load staff members",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStaffList();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a staff member",
        variant: "destructive",
      });
      return;
    }

    if (password === "staff123") {
      const staffMember = staffList.find(staff => staff.id.toString() === selectedStaff);
      if (staffMember) {
        login(staffMember.name, password, staffMember.role);
        toast({
          title: "Welcome back! 👋",
          description: "Successfully logged in",
        });
        navigate("/");
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid password. Try staff123",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="pl-10 bg-white/50 border-muted h-12 rounded-2xl">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          Demo password: staff123
        </div>
      </Card>
    </div>
  );
};

export default Login;