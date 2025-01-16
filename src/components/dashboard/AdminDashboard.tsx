import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { AttendanceTable } from "./AttendanceTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch staff profiles from Supabase
  const { data: staffProfiles, isError } = useQuery({
    queryKey: ['staffProfiles'],
    queryFn: async () => {
      console.log('Fetching staff profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching staff profiles:', error);
        toast({
          title: "Error loading staff profiles",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log('Fetched staff profiles:', data);
      return data;
    },
    retry: 2,
  });

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
              {isError ? "Error loading staff count" : `${staffProfiles?.length || 0} staff members registered`}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Check-ins</h2>
        <AttendanceTable />
      </Card>
    </div>
  );
};