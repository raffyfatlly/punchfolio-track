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
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
}

const Analytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("march");
  const [selectedName, setSelectedName] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useAuth();

  // Get staff list from localStorage with proper typing
  const staffList = JSON.parse(localStorage.getItem('staff-list') || '[]') as StaffMember[];
  const staffNames = staffList.map((staff) => staff.name);

  // Mock data with dates on x-axis and times on y-axis, filtered to only include existing staff
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
  ].filter(record => staffNames.includes(record.name));

  // Get unique names for the dropdown from staff list
  const uniqueNames = useMemo(() => 
    Array.from(new Set(staffNames)),
    [staffNames]
  );

  // Filter attendance data based on name
  const filteredAttendance = useMemo(() => 
    attendanceData.filter(record =>
      selectedName === "all" ? true : record.name === selectedName
    ),
    [selectedName, attendanceData]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredAttendance.slice(startIndex, endIndex);

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

  // Calculate statistics based on filtered data
  const totalRecords = filteredAttendance.length;
  const onTimeCount = filteredAttendance.filter(record => record.status === "on-time").length;
  const lateCount = filteredAttendance.filter(record => record.status === "late").length;
  const tooEarlyCount = filteredAttendance.filter(record => record.status === "too-early").length;

  const getStatusColor = (status: "on-time" | "late" | "too-early") => {
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

  // Format date for x-axis
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for y-axis
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
            <SelectItem value="all">All Names</SelectItem>
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
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="opacity-30"
                  stroke="var(--secondary)"
                />
                <XAxis 
                  dataKey="date" 
                  stroke="currentColor"
                  tickFormatter={formatDate}
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  tickLine={{ stroke: 'var(--secondary)' }}
                  axisLine={{ stroke: 'var(--secondary)' }}
                  label={{ 
                    value: 'Date', 
                    position: 'bottom',
                    offset: 0,
                    fill: 'var(--foreground)'
                  }}
                />
                <YAxis 
                  stroke="currentColor"
                  ticks={timeTicks}
                  tickFormatter={formatTime}
                  tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                  tickLine={{ stroke: 'var(--secondary)' }}
                  axisLine={{ stroke: 'var(--secondary)' }}
                  label={{ 
                    value: 'Check-in Time', 
                    angle: -90, 
                    position: 'left',
                    offset: -35,
                    fill: 'var(--foreground)'
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid var(--secondary)',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  labelFormatter={formatDate}
                  formatter={(value: string) => [formatTime(value), 'Check-in Time']}
                />
                <Line 
                  type="monotone" 
                  dataKey="checkInTime"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ 
                    fill: "var(--primary)",
                    stroke: "white",
                    strokeWidth: 2,
                    r: 4
                  }}
                  activeDot={{
                    fill: "var(--primary)",
                    stroke: "white",
                    strokeWidth: 2,
                    r: 6
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border-secondary/20">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Attendance Records</h2>
          <ScrollArea className="h-[300px] w-full">
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
                {currentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkInTime}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
