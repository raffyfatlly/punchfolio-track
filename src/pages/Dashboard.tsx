import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parse, isAfter, isBefore, addMinutes } from "date-fns";

const CLOCK_IN_TIME = "09:00";
const EARLY_BUFFER = 20;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get attendance records from localStorage
  const attendanceRecords = JSON.parse(localStorage.getItem('attendance-records') || '[]');
  
  // Filter records for the current user and sort by date (most recent first)
  const recentAttendance = attendanceRecords
    .filter((record: any) => record.name === user?.name)
    .sort((a: any, b: any) => {
      const dateA = new Date(`${a.date}T${a.checkInTime}`);
      const dateB = new Date(`${b.date}T${b.checkInTime}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-red-100 text-red-800";
      case "too-early":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-time":
        return "On Time";
      case "late":
        return "Late";
      case "too-early":
        return "Too Early";
      default:
        return status;
    }
  };
  
  // Only show simplified view for staff
  if (user?.role === "staff") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back, {user.name}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-MY', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              timeZone: 'Asia/Kuala_Lumpur'
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
                <Clock className="h-12 w-12 text-primary" />
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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Recent Attendance</h2>
          {recentAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendance.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkInTime}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No attendance records found</p>
          )}
        </Card>
      </div>
    );
  }

  // Admin view
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

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Check-ins</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Photo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords
                .filter((record: any) => {
                  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
                  return record.date === today;
                })
                .map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.checkInTime}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {record.photo && (
                        <img 
                          src={record.photo} 
                          alt={`${record.name}'s check-in`} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
