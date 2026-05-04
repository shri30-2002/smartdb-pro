export default function ServerCard({ server, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{server.name}</h3>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {server.host}:{server.port}
      </p>

      <div className="flex justify-between">
        <button
          onClick={() => onEdit(server)}
          className="px-3 py-1 bg-yellow-400 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(server.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}