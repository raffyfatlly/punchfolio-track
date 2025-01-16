import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceRecord {
  id: number;
  date: string;
  check_in_time: string;
  status: string;
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
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['attendance', profileId],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select(`
          id,
          date,
          check_in_time,
          status,
          profile:profiles(name)
        `)
        .order('date', { ascending: false })
        .order('check_in_time', { ascending: false });

      if (profileId) {
        query = query.eq('profile_id', profileId);
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AttendanceRecord[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};