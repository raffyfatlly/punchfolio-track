import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const Staff = () => {
  const [staffList, setStaffList] = useState([
    { id: 1, name: "John Doe", position: "Manager", department: "Operations" },
    { id: 2, name: "Jane Smith", position: "Developer", department: "IT" },
  ]);

  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    department: "",
  });

  const { toast } = useToast();

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.position && newStaff.department) {
      setStaffList([
        ...staffList,
        {
          id: staffList.length + 1,
          ...newStaff,
        },
      ]);
      setNewStaff({ name: "", position: "", department: "" });
      toast({
        title: "Staff member added",
        description: `${newStaff.name} has been added to the staff list.`,
      });
    }
  };

  const handleDeleteStaff = (id: number, name: string) => {
    setStaffList(staffList.filter((staff) => staff.id !== id));
    toast({
      title: "Staff member removed",
      description: `${name} has been removed from the staff list.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Staff Management
        </h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[1rem]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
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
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newStaff.position}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, position: e.target.value })
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
              <Button onClick={handleAddStaff} className="w-full rounded-lg">
                Add Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {staffList.map((staff) => (
          <Card key={staff.id} className="p-4 rounded-[1rem] border-none bg-gradient-to-br from-white to-muted/20">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold">{staff.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {staff.position} - {staff.department}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
                      onClick={() => handleDeleteStaff(staff.id, staff.name)}
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