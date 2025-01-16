// Types for our data structures
export interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  checkInTime: string;
  status: "on-time" | "late";
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

// Initialize storage with admin if it doesn't exist
const initializeStorage = () => {
  const existingStaff = localStorage.getItem(KEYS.STAFF);
  if (!existingStaff) {
    const initialStaff = [{
      id: 0,
      name: "Admin",
      position: "Administrator",
      department: "Management"
    }];
    localStorage.setItem(KEYS.STAFF, JSON.stringify(initialStaff));
  } else {
    // Ensure admin exists in the staff list
    const staff = JSON.parse(existingStaff);
    const hasAdmin = staff.some((s: StaffMember) => s.id === 0);
    if (!hasAdmin) {
      const adminUser = {
        id: 0,
        name: "Admin",
        position: "Administrator",
        department: "Management"
      };
      localStorage.setItem(KEYS.STAFF, JSON.stringify([adminUser]));
    }
  }

  // Initialize empty attendance records if they don't exist
  if (!localStorage.getItem(KEYS.ATTENDANCE)) {
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
  }
};

// Run initialization
initializeStorage();

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
    if (!staff) {
      // If no staff exists, reinitialize with admin
      initializeStorage();
      return [{
        id: 0,
        name: "Admin",
        position: "Administrator",
        department: "Management"
      }];
    }
    return JSON.parse(staff);
  },

  // Add new staff member
  addStaffMember: (staffMember: Omit<StaffMember, "id">): void => {
    const currentStaff = staffService.getAllStaff();
    const newStaffMember = {
      id: Math.max(...currentStaff.map(s => s.id)) + 1,
      ...staffMember,
    };
    localStorage.setItem(KEYS.STAFF, JSON.stringify([...currentStaff, newStaffMember]));
  },

  // Delete staff member
  deleteStaffMember: (id: number): void => {
    if (id === 0) return; // Prevent deleting admin
    const currentStaff = staffService.getAllStaff();
    const updatedStaff = currentStaff.filter(member => member.id !== id);
    localStorage.setItem(KEYS.STAFF, JSON.stringify(updatedStaff));
  },
};