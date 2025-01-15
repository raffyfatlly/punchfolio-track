import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Only show simplified view for staff
  if (user?.role === "staff") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-muted/20 rounded-[2rem] border-none">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-75 blur"></div>
              <Button 
                size="lg"
                className="relative h-32 w-32 rounded-full bg-white hover:bg-white/90"
                onClick={() => navigate("/check-in")}
              >
                <Camera className="h-12 w-12 text-primary" />
              </Button>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Check In</h2>
              <p className="text-muted-foreground">
                Quick and easy attendance recording
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last check-in: Not available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Staff Management Portal
      </h1>
      
      <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-muted/20 rounded-[2rem] border-none">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-75 blur"></div>
            <Button 
              size="lg"
              className="relative h-32 w-32 rounded-full bg-white hover:bg-white/90"
              onClick={() => navigate("/staff")}
            >
              <Users className="h-12 w-12 text-primary" />
            </Button>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Manage Staff</h2>
            <p className="text-muted-foreground">
              View and manage staff members
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;