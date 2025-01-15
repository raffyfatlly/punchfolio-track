import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("march");
  const [nameFilter, setNameFilter] = useState("");

  // Mock data with dates on x-axis and times on y-axis
  const attendanceData = [
    { 
      id: 1,
      name: "John Doe",
      date: "2024-03-20",
      checkInTime: "08:45",
      status: "on-time",
    },
    { 
      id: 2,
      name: "Jane Smith",
      date: "2024-03-20",
      checkInTime: "09:15",
      status: "late",
    },
    { 
      id: 3,
      name: "Mike Johnson",
      date: "2024-03-20",
      checkInTime: "08:30",
      status: "too-early",
    },
    // Additional data points for different dates
    { 
      id: 4,
      name: "John Doe",
      date: "2024-03-21",
      checkInTime: "08:30",
      status: "on-time",
    },
    { 
      id: 5,
      name: "Jane Smith",
      date: "2024-03-21",
      checkInTime: "09:45",
      status: "late",
    },
    { 
      id: 6,
      name: "Mike Johnson",
      date: "2024-03-21",
      checkInTime: "08:15",
      status: "too-early",
    },
  ];

  // Filter attendance data based on name
  const filteredAttendance = useMemo(() => 
    attendanceData.filter(record =>
      record.name.toLowerCase().includes(nameFilter.toLowerCase())
    ),
    [nameFilter, attendanceData]
  );

  // Generate chart data based on filtered attendance
  const chartData = useMemo(() => {
    const dateGroups = filteredAttendance.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = {
          date: date,
          "08:00": 0,
          "09:00": 0,
          "10:00": 0,
        };
      }
      
      // Increment the appropriate hour based on check-in time
      const hour = parseInt(record.checkInTime.split(":")[0]);
      const timeKey = `${hour.toString().padStart(2, "0")}:00`;
      if (acc[date][timeKey] !== undefined) {
        acc[date][timeKey]++;
      }
      
      return acc;
    }, {});

    return Object.values(dateGroups);
  }, [filteredAttendance]);

  // Calculate statistics
  const totalRecords = filteredAttendance.length;
  const onTimeCount = filteredAttendance.filter(record => record.status === "on-time").length;
  const lateCount = filteredAttendance.filter(record => record.status === "late").length;
  const tooEarlyCount = filteredAttendance.filter(record => record.status === "too-early").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-secondary/20 text-secondary";
      case "late":
        return "bg-primary/20 text-primary";
      case "too-early":
        return "bg-accent/20 text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-time":
        return "On Time";
      case "late":
        return "Late";
      case "too-early":
        return "Too Early";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-xs border-secondary/20"
        />
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="max-w-xs border-secondary/20">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January</SelectItem>
            <SelectItem value="february">February</SelectItem>
            <SelectItem value="march">March</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-primary/20">
          <h3 className="text-lg font-medium text-foreground">Total Check-ins</h3>
          <p className="text-3xl font-bold text-primary">{totalRecords}</p>
        </Card>
        <Card className="p-4 bg-white border-secondary/20">
          <h3 className="text-lg font-medium text-foreground">On Time</h3>
          <p className="text-3xl font-bold text-secondary">{onTimeCount}</p>
        </Card>
        <Card className="p-4 bg-white border-primary/20">
          <h3 className="text-lg font-medium text-foreground">Late</h3>
          <p className="text-3xl font-bold text-primary">{lateCount}</p>
        </Card>
        <Card className="p-4 bg-white border-secondary/20">
          <h3 className="text-lg font-medium text-foreground">Too Early</h3>
          <p className="text-3xl font-bold text-secondary">{tooEarlyCount}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-secondary/20">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Check-in Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="date" 
                  stroke="currentColor"
                />
                <YAxis 
                  stroke="currentColor"
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid var(--secondary)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="08:00"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="09:00"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--secondary)" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="10:00"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: "var(--accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border-primary/20">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Detailed Attendance Records</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkInTime}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;