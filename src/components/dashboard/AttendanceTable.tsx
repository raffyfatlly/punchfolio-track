import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AttendanceRecord {
  id: number;
  date: string;
  check_in_time: string;
  status: string;
  photo: string | null;
  profile: {
    name: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "on-time":
      return "bg-green-100 text-green-800";
    case "late":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "on-time":
      return "On Time";
    case "late":
      return "Late";
    default:
      return status;
  }
};

interface Props {
  profileId?: number;
  limit?: number;
}

export const AttendanceTable = ({ profileId, limit }: Props) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ['attendance', profileId],
    queryFn: async () => {
      console.log('Fetching attendance records for profileId:', profileId);
      
      let query = supabase
        .from('attendance')
        .select(`
          id,
          date,
          check_in_time,
          status,
          photo,
          profile:profiles(name)
        `)
        .order('date', { ascending: false })
        .order('check_in_time', { ascending: false });

      // If user is not admin, only show their own records
      if (user?.role !== 'admin') {
        // Convert string ID to number using parseInt
        const userProfileId = user?.id ? parseInt(user.id) : undefined;
        if (!userProfileId) {
          throw new Error('Invalid user profile ID');
        }
        query = query.eq('profile_id', userProfileId);
      } else if (profileId) {
        // If admin is viewing a specific profile
        query = query.eq('profile_id', profileId);
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Fetched attendance records:', data);
      return data as AttendanceRecord[];
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    retry: 2,
    meta: {
      onError: () => {
        toast({
          title: "Error loading attendance records",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    }
  });

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading attendance records. Please try refreshing the page.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading attendance records...
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No attendance records found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {!profileId && <TableHead>Name</TableHead>}
            <TableHead>Date</TableHead>
            <TableHead>Check-in Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Photo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              {!profileId && <TableCell>{record.profile.name}</TableCell>}
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.check_in_time}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
              </TableCell>
              <TableCell>
                {record.photo && (
                  <img 
                    src={record.photo} 
                    alt="Check-in photo" 
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};