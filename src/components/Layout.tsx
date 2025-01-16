import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export function Layout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, isLoading, location.pathname, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 relative bg-gradient-to-br from-white via-white to-accent/10">
          <div className="sticky top-0 z-10 pb-4 backdrop-blur-sm">
            <SidebarTrigger className="md:hidden" />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}