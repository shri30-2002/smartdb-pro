import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
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
    if (!window.confirm("Are you sure?")) return;

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

  // Chart Data
  const chartData = servers.map((s, index) => ({
    name: s.name || `Server ${index + 1}`,
    value: index + 1
  }));

  return (
    <div style={{
      fontFamily: "Arial",
      background: "#f5f7fb",
      minHeight: "100vh",
      padding: "30px"
    }}>

      <h1>🚀 SmartDB Pro Dashboard</h1>

      {/* STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "200px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Total Servers</h3>
          <p style={{ fontSize: "24px" }}>{servers.length}</p>
        </div>

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "200px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Active Servers</h3>
          <p style={{ fontSize: "24px" }}>{servers.length}</p>
        </div>
      </div>

      {/* CHART */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>Server Analytics</h2>

        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

      {/* FORM */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>{editingId ? "Edit Server" : "Add Server"}</h2>

        <input
          name="name"
          placeholder="Server Name"
          value={form.name}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />

        <input
          name="host"
          placeholder="Host"
          value={form.host}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />

        <input
          name="port"
          placeholder="Port"
          value={form.port}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", padding: "8px", width: "300px" }}
        />

        <button
          onClick={editingId ? updateServer : addServer}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          {editingId ? "Update Server" : "Add Server"}
        </button>
      </div>

      {/* SERVER LIST */}
      <h2>Connected Servers</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {servers.map((server) => (
          <div key={server.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            width: "250px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3>{server.name}</h3>
            <p>{server.host}:{server.port}</p>

            <button onClick={() => {
              setEditingId(server.id);
              setForm(server);
            }}>
              Edit
            </button>

            <button
              onClick={() => deleteServer(server.id)}
              style={{ marginLeft: "10px", background: "red", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;