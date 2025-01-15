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

const Analytics = () => {
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