import { useAuth } from "@/contexts/AuthContext";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === "staff") {
    return <StaffDashboard />;
  }

  return <AdminDashboard />;
};

export default Dashboard;