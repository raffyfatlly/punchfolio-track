import { Camera, Users, BarChart2, Home, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const staffItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Check In", url: "/check-in", icon: Camera },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Staff", url: "/staff", icon: Users },
    { title: "Analytics", url: "/analytics", icon: BarChart2 },
  ];

  const items = user?.role === "admin" ? adminItems : staffItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2">
            {user?.role === "admin" ? "Management" : "Staff Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="flex items-center gap-3 px-2 py-2 w-full rounded-md hover:bg-accent"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-2 py-2 w-full rounded-md hover:bg-accent text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}