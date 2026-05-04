export default function StatsCards({ servers }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <h3>Total Servers</h3>
        <p className="text-2xl font-bold">{servers.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <h3>Active Servers</h3>
        <p className="text-2xl font-bold">{servers.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <h3>Last Added</h3>
        <p className="text-2xl font-bold">
          {servers.length ? servers[servers.length - 1].name : "—"}
        </p>
      </div>
    </div>
  );
}