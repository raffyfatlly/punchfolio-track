import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const attendanceData = [
    { day: "Mon", count: 45 },
    { day: "Tue", count: 42 },
    { day: "Wed", count: 48 },
    { day: "Thu", count: 44 },
    { day: "Fri", count: 40 },
  ];

  const recentCheckIns = [
    { name: "John Doe", time: "09:00 AM", date: "2024-03-20" },
    { name: "Jane Smith", time: "09:15 AM", date: "2024-03-20" },
    { name: "Mike Johnson", time: "09:30 AM", date: "2024-03-20" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Attendance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1e40af" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Check-ins</h2>
          <div className="space-y-4">
            {recentCheckIns.map((checkin, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg"
              >
                <div>
                  <p className="font-medium">{checkin.name}</p>
                  <p className="text-sm text-muted-foreground">{checkin.date}</p>
                </div>
                <p className="text-primary font-medium">{checkin.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;