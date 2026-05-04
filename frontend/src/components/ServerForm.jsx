export default function ServerForm({
  form,
  setForm,
  editingId,
  onSubmit
}) {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8 max-w-md">
      <h2 className="text-xl mb-4">
        {editingId ? "Edit Server" : "Add Server"}
      </h2>

      <input
        name="name"
        placeholder="Server Name"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
      />

      <input
        name="host"
        placeholder="Host"
        value={form.host}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
      />

      <input
        name="port"
        placeholder="Port"
        value={form.port}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded dark:bg-gray-700"
      />

      <button
        onClick={onSubmit}
        className="w-full py-2 bg-green-500 text-white rounded"
      >
        {editingId ? "Update" : "Add"}
      </button>
    </div>
  );
}