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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                />
              </div>
              <Button onClick={handleAddStaff} className="w-full">
                Add Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {staffList.map((staff) => (
          <Card key={staff.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{staff.name}</h3>
              <p className="text-sm text-muted-foreground">
                {staff.position} - {staff.department}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Staff;