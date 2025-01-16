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

// Define interfaces for our data structures
interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  checkInTime: string;
  status: "on-time" | "late" | "too-early";
}

interface ChartDataPoint {
  date: string;
  checkInTime: string;
  value: number;
}

interface DateGroups {
  [key: string]: ChartDataPoint;
}

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("march");
  const [selectedName, setSelectedName] = useState("");

  // Mock data with dates on x-axis and times on y-axis
  const attendanceData: AttendanceRecord[] = [
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

  // Get unique names for the dropdown
  const uniqueNames = useMemo(() => 
    Array.from(new Set(attendanceData.map(record => record.name))),
    [attendanceData]
  );

  // Filter attendance data based on name
  const filteredAttendance = useMemo(() => 
    attendanceData.filter(record =>
      selectedName ? record.name === selectedName : true
    ),
    [selectedName, attendanceData]
  );

  // Generate chart data based on filtered attendance
  const chartData = useMemo(() => {
    const dateGroups = filteredAttendance.reduce<DateGroups>((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          checkInTime: record.checkInTime,
          value: 1,
        };
      }
      return acc;
    }, {});

    return Object.values(dateGroups).sort((a, b) => 
      a.checkInTime.localeCompare(b.checkInTime)
    );
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

  // Generate time ticks for Y-axis
  const timeTicks = ["07:00", "08:00", "09:00", "10:00", "11:00"];

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedName} onValueChange={setSelectedName}>
          <SelectTrigger className="max-w-xs border-secondary/20">
            <SelectValue placeholder="Filter by name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Names</SelectItem>
            {uniqueNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  ticks={timeTicks}
                  domain={['07:00', '11:00']}
                  type="category"
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
                  dataKey="checkInTime"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)" }}
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