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
    <Sidebar className="bg-gradient-to-br from-accent to-secondary border-r border-accent/20 [&[data-mobile]]:!bg-gradient-to-br [&[data-mobile]]:!from-accent [&[data-mobile]]:!to-secondary [&>div[data-radix-scroll-area-viewport]]:!bg-transparent [&>div]:!bg-transparent">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-secondary-foreground/80 font-semibold">
            {user?.role === "admin" ? "Management" : "Staff Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md hover:bg-white/30 text-secondary-foreground transition-colors duration-200"
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