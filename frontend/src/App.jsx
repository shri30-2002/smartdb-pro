import { useEffect, useState } from "react";

function App() {
  const [servers, setServers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    host: "",
    port: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch servers
  const fetchServers = async () => {
    const res = await fetch("http://127.0.0.1:8000/servers");
    const data = await res.json();
    setServers(data);
  };

  useEffect(() => {
    fetchServers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add server
  const addServer = async () => {
    await fetch("http://127.0.0.1:8000/add-server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    fetchServers();
    setForm({ name: "", host: "", port: "" });
  };

  // Delete server
  const deleteServer = async (id) => {
    await fetch(`http://127.0.0.1:8000/delete-server/${id}`, {
      method: "DELETE"
    });

    fetchServers();
  };

  // Update server
  const updateServer = async () => {
    await fetch(`http://127.0.0.1:8000/update-server/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setEditingId(null);
    setForm({ name: "", host: "", port: "" });
    fetchServers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>SmartDB Pro Dashboard</h1>

      <h2>Add Server</h2>

      <input
        name="name"
        placeholder="Server Name"
        value={form.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="host"
        placeholder="Host"
        value={form.host}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="port"
        placeholder="Port"
        value={form.port}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={editingId ? updateServer : addServer}>
        {editingId ? "Update Server" : "Add Server"}
      </button>

      <h2>Connected Servers</h2>

      {servers.length === 0 ? (
        <p>No servers found</p>
      ) : (
        <ul>
          {servers.map((server) => (
            <li key={server.id}>
              {server.name} - {server.host}:{server.port}

              <button onClick={() => {
                setEditingId(server.id);
                setForm({
                  name: server.name,
                  host: server.host,
                  port: server.port
                });
              }}>
                Edit
              </button>

              <button onClick={() => deleteServer(server.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;