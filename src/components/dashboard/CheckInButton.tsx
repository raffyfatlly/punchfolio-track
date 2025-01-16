import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CheckInButton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-75 blur"></div>
        <Button 
          size="lg"
          className="relative h-32 w-32 rounded-full bg-white hover:bg-white/90"
          onClick={() => navigate("/check-in")}
        >
          <Clock className="h-12 w-12 text-primary" />
        </Button>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Check In</h2>
        <p className="text-muted-foreground">
          Record your attendance
        </p>
      </div>
    </div>
  );
};