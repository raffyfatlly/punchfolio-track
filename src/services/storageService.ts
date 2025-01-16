// Types for our data structures
export interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  checkInTime: string;
  status: "on-time" | "late" | "too-early";
  photo?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  department: string;
}

// Storage keys
const KEYS = {
  ATTENDANCE: 'attendance-records',
  STAFF: 'staff-list',
} as const;

// Attendance records operations
export const attendanceService = {
  // Get all attendance records
  getAllRecords: (): AttendanceRecord[] => {
    const records = localStorage.getItem(KEYS.ATTENDANCE);
    return records ? JSON.parse(records) : [];
  },

  // Get today's records
  getTodayRecords: (): AttendanceRecord[] => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    return attendanceService.getAllRecords().filter(record => record.date === today);
  },

  // Get user's recent records
  getUserRecentRecords: (userName: string, limit: number = 3): AttendanceRecord[] => {
    return attendanceService.getAllRecords()
      .filter(record => record.name === userName)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.checkInTime}`);
        const dateB = new Date(`${b.date}T${b.checkInTime}`);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  },

  // Save new attendance record
  saveRecord: (record: AttendanceRecord): void => {
    const records = attendanceService.getAllRecords();
    // Filter out any previous records from the same user on the same day
    const filteredRecords = records.filter(
      existing => !(existing.name === record.name && existing.date === record.date)
    );
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([record, ...filteredRecords]));
  },
};

// Staff operations
export const staffService = {
  // Get all staff members
  getAllStaff: (): StaffMember[] => {
    const staff = localStorage.getItem(KEYS.STAFF);
    const staffMembers = staff ? JSON.parse(staff) : [];
    // Always include admin in the list
    return [
      { id: 0, name: "Admin", position: "Administrator", department: "Management" },
      ...staffMembers
    ];
  },

  // Add new staff member
  addStaffMember: (staffMember: Omit<StaffMember, "id">): void => {
    const staff = staffService.getAllStaff().filter(s => s.id !== 0); // Remove admin before adding
    const newStaffMember = {
      id: Date.now(),
      ...staffMember,
    };
    localStorage.setItem(KEYS.STAFF, JSON.stringify([...staff, newStaffMember]));
  },

  // Delete staff member
  deleteStaffMember: (id: number): void => {
    const staff = staffService.getAllStaff().filter(s => s.id !== 0); // Remove admin before filtering
    localStorage.setItem(
      KEYS.STAFF,
      JSON.stringify(staff.filter(member => member.id !== id))
    );
  },
};