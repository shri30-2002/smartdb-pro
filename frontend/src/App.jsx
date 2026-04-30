import { useEffect, useState } from "react";

function App() {
  const [servers, setServers] = useState([]);

  // Fetch servers from backend
  const fetchServers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/servers");
      const data = await res.json();
      setServers(data);
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  };

  // Run on page load
  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>SmartDB Pro Dashboard</h1>

      <h2>Connected Servers</h2>

      {servers.length === 0 ? (
        <p>No servers found</p>
      ) : (
        <ul>
          {servers.map((server) => (
            <li key={server.id}>
              {server.name} - {server.host}:{server.port}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;