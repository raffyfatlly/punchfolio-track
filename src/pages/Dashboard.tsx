import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera, Users } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Staff Attendance</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Camera className="w-12 h-12 text-primary" />
            <h2 className="text-xl font-semibold">Check In</h2>
            <p className="text-center text-muted-foreground">
              Take a photo to record your attendance
            </p>
            <Button onClick={() => navigate("/check-in")} className="w-full">
              Start Check In
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Users className="w-12 h-12 text-primary" />
            <h2 className="text-xl font-semibold">Manage Staff</h2>
            <p className="text-center text-muted-foreground">
              Add or view staff members
            </p>
            <Button onClick={() => navigate("/staff")} className="w-full">
              View Staff
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;