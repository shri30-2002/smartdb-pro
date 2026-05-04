import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function ChartSection({ servers }) {
  const data = servers.map((s, i) => ({
    name: s.name || `S${i + 1}`,
    value: i + 1,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
      <h2 className="text-xl mb-4">Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}