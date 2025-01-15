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
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("march");
  const [nameFilter, setNameFilter] = useState("");

  // Mock data - in a real app, this would come from your backend
  const attendanceData = [
    { 
      id: 1,
      name: "John Doe",
      date: "2024-03-20",
      checkInTime: "09:00",
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
      checkInTime: "08:45",
      status: "on-time",
    },
    // Add more attendance records as needed
  ];

  const hourlyData = [
    { time: "8 AM", checkins: 12 },
    { time: "9 AM", checkins: 28 },
    { time: "10 AM", checkins: 15 },
    { time: "11 AM", checkins: 8 },
    { time: "12 PM", checkins: 20 },
    { time: "1 PM", checkins: 25 },
    { time: "2 PM", checkins: 18 },
    { time: "3 PM", checkins: 10 },
    { time: "4 PM", checkins: 5 },
  ];

  // Filter attendance data based on name
  const filteredAttendance = attendanceData.filter(record =>
    record.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Calculate statistics
  const totalRecords = filteredAttendance.length;
  const onTimeCount = filteredAttendance.filter(record => record.status === "on-time").length;
  const lateCount = filteredAttendance.filter(record => record.status === "late").length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January</SelectItem>
            <SelectItem value="february">February</SelectItem>
            <SelectItem value="march">March</SelectItem>
            {/* Add more months */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium">Total Check-ins</h3>
          <p className="text-3xl font-bold">{totalRecords}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium">On Time</h3>
          <p className="text-3xl font-bold text-green-500">{onTimeCount}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium">Late</h3>
          <p className="text-3xl font-bold text-red-500">{lateCount}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Check-in Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: 'currentColor' }}
                  tickLine={{ stroke: 'currentColor' }}
                />
                <YAxis 
                  tick={{ fill: 'currentColor' }}
                  tickLine={{ stroke: 'currentColor' }}
                  label={{ 
                    value: 'Check-ins', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'currentColor'
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="checkins" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)" }}
                  activeDot={{ r: 6, fill: "var(--primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Attendance Records</h2>
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
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkInTime}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        record.status === 'on-time' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'on-time' ? 'On Time' : 'Late'}
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