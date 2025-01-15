import { Menu, UserRound, UserCheck, UserPlus, UserMinus, UserX, LogOut } from "lucide-react";
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

const staffIcons = {
  "John Doe": { icon: UserRound, color: "text-staff-blue" },
  "Jane Smith": { icon: UserCheck, color: "text-staff-purple" },
  "Mike Johnson": { icon: UserPlus, color: "text-staff-orange" },
  "Sarah Williams": { icon: UserMinus, color: "text-staff-green" },
  "Tom Brown": { icon: UserX, color: "text-staff-red" },
};

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const staffItems = [
    { title: "Dashboard", url: "/", icon: Menu },
    { title: "Check In", url: "/check-in", icon: UserCheck },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/", icon: Menu },
    { title: "Staff", url: "/staff", icon: UserRound },
    { title: "Analytics", url: "/analytics", icon: UserPlus },
  ];

  const items = user?.role === "admin" ? adminItems : staffItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar className="bg-white border-r border-accent/20 [&[data-mobile]]:!bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-primary font-semibold">
            {user?.role === "admin" ? "Management" : "Staff Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md hover:bg-accent text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors duration-200"
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