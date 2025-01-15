import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 bg-white relative">
          <div className="sticky top-0 z-10 bg-white pb-4">
            <SidebarTrigger className="md:hidden" />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}