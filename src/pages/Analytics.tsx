import { Card } from "@/components/ui/card";
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
  status: "on-time" | "late";
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
}

const Analytics = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedName, setSelectedName] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useAuth();

  // Get staff list from localStorage with proper typing
  const staffList = JSON.parse(localStorage.getItem('staff-list') || '[]') as StaffMember[];
  const staffNames = staffList.map((staff) => staff.name);

  // Mock data with dates, filtered to only include existing staff
  const attendanceData: AttendanceRecord[] = [
    { 
      id: 1,
      name: "John Doe",
      date: "2024-03-20",
      checkInTime: "08:45",
      status: "on-time" as const,
    },
    { 
      id: 2,
      name: "Jane Smith",
      date: "2024-03-20",
      checkInTime: "09:15",
      status: "late" as const,
    },
    { 
      id: 3,
      name: "Mike Johnson",
      date: "2024-02-20",
      checkInTime: "08:30",
      status: "on-time" as const,
    },
    { 
      id: 4,
      name: "John Doe",
      date: "2023-12-21",
      checkInTime: "08:30",
      status: "on-time" as const,
    },
    { 
      id: 5,
      name: "Jane Smith",
      date: "2024-03-21",
      checkInTime: "09:45",
      status: "late" as const,
    },
    { 
      id: 6,
      name: "Mike Johnson",
      date: "2024-03-21",
      checkInTime: "08:15",
      status: "on-time" as const,
    },
  ].filter(record => staffNames.includes(record.name));

  // Get unique names for the dropdown from staff list
  const uniqueNames = useMemo(() => 
    Array.from(new Set(staffNames)),
    [staffNames]
  );

  // Filter attendance data based on name, month, and year
  const filteredAttendance = useMemo(() => 
    attendanceData.filter(record => {
      const matchesName = selectedName === "all" ? true : record.name === selectedName;
      const [recordYear, recordMonth] = record.date.split('-');
      const matchesMonth = selectedMonth === "all" ? true : recordMonth === selectedMonth;
      const matchesYear = selectedYear === "all" ? true : recordYear === selectedYear;
      return matchesName && matchesMonth && matchesYear;
    }),
    [selectedName, selectedMonth, selectedYear, attendanceData]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredAttendance.slice(startIndex, endIndex);

  // Calculate statistics
  const totalRecords = filteredAttendance.length;
  const onTimeCount = filteredAttendance.filter(record => record.status === "on-time").length;
  const lateCount = filteredAttendance.filter(record => record.status === "late").length;

  const getStatusColor = (status: "on-time" | "late") => {
    switch (status) {
      case "on-time":
        return "bg-secondary/20 text-secondary";
      case "late":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get available years from attendance data
  const availableYears = useMemo(() => {
    const years = new Set(attendanceData.map(record => record.date.split('-')[0]));
    return Array.from(years).sort((a, b) => Number(b) - Number(a)); // Sort descending
  }, [attendanceData]);

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
            <SelectItem value="all">All Months</SelectItem>
            <SelectItem value="01">January</SelectItem>
            <SelectItem value="02">February</SelectItem>
            <SelectItem value="03">March</SelectItem>
            <SelectItem value="04">April</SelectItem>
            <SelectItem value="05">May</SelectItem>
            <SelectItem value="06">June</SelectItem>
            <SelectItem value="07">July</SelectItem>
            <SelectItem value="08">August</SelectItem>
            <SelectItem value="09">September</SelectItem>
            <SelectItem value="10">October</SelectItem>
            <SelectItem value="11">November</SelectItem>
            <SelectItem value="12">December</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="max-w-xs border-secondary/20">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
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
      </div>

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
  );
};

export default Analytics;