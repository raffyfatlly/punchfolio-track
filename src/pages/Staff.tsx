import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Staff = () => {
  const [newStaff, setNewStaff] = useState({
    name: "",
    department: "",
    role: "staff" as const,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only administrators can access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  // Fetch staff profiles from Supabase
  const { data: staffList, isLoading } = useQuery({
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
    enabled: !!user && user.role === "admin", // Only fetch if user is admin
  });

  // Add new staff member mutation
  const addStaffMutation = useMutation({
    mutationFn: async (newStaffData: typeof newStaff) => {
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([newStaffData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffProfiles'] });
      toast({
        title: "Staff member added",
        description: `${newStaff.name} has been added to the staff list.`,
      });
      setNewStaff({ name: "", department: "", role: "staff" });
    },
    onError: (error) => {
      toast({
        title: "Error adding staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete staff member mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['staffProfiles'] });
      toast({
        title: "Staff member removed",
        description: "The staff member has been removed from the list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing staff member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.department) {
      addStaffMutation.mutate(newStaff);
    }
  };

  if (!user || user.role !== "admin") {
    return null; // Don't render anything if not admin
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Staff Management
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[1rem]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Enter the details of the new staff member below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newStaff.department}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, department: e.target.value })
                  }
                  className="rounded-lg"
                />
              </div>
              <Button 
                onClick={handleAddStaff} 
                className="w-full rounded-lg bg-secondary hover:bg-secondary/90"
                disabled={addStaffMutation.isPending}
              >
                {addStaffMutation.isPending ? "Adding..." : "Add Staff Member"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {staffList?.map((staff) => (
          <Card key={staff.id} className="p-4 rounded-[1rem] border-none bg-gradient-to-br from-white to-accent/20">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{staff.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {staff.department} - {staff.role}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={deleteStaffMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[1rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {staff.name} from the staff list? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-lg bg-destructive hover:bg-destructive/90"
                      onClick={() => deleteStaffMutation.mutate(staff.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Staff;