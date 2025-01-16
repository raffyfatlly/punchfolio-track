import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeHeader } from "./WelcomeHeader";
import { CheckInButton } from "./CheckInButton";
import { AttendanceTable } from "./AttendanceTable";

export const StaffDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <WelcomeHeader />

      <Card className="p-8 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-muted/20 rounded-[2rem] border-none">
        <CheckInButton />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Your Recent Attendance</h2>
        {user?.id ? (
          <AttendanceTable profileId={Number(user.id)} limit={3} />
        ) : (
          <p className="text-center text-muted-foreground">No attendance records found</p>
        )}
      </Card>
    </div>
  );
};