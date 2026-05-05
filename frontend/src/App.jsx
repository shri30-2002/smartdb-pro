import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function App() {
  /* ---------------- AUTH ---------------- */
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  /* ---------------- SERVER STATES ---------------- */
  const [serverName, setServerName] = useState("");
  const [serverHost, setServerHost] = useState("");
  const [serverPort, setServerPort] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------------- TOAST ---------------- */
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "token",
          result.access_token
        );

        setIsLoggedIn(true);
        setLoginError("");
      } else {
        setLoginError(result.detail);
      }
    } catch (error) {
      setLoginError("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  /* ---------------- DASHBOARD ---------------- */
  const [data, setData] = useState({
    cpu: 0,
    ram: 0,
    disk: 0,
    database_status: "Checking...",
    servers: []
  });

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/scan"
      );

      const result = await res.json();

      setData(result);
      setLoading(false);

      const currentTime =
        new Date().toLocaleTimeString();

      setHistory((prev) => [
        ...prev.slice(-9),
        {
          time: currentTime,
          cpu: result.cpu,
          ram: result.ram,
          disk: result.disk
        }
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- ADD / EDIT SERVER ---------------- */
  const addServer = async () => {
    try {
      const url =
        isEditing
          ? `http://127.0.0.1:8000/update-server/${editIndex}`
          : "http://127.0.0.1:8000/add-server";

      const method = isEditing ? "PUT" : "POST";

      await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: serverName,
          host: serverHost,
          port: Number(serverPort)
        })
      });

      setServerName("");
      setServerHost("");
      setServerPort("");
      setEditIndex(null);
      setIsEditing(false);

      fetchStats();

      showToast(
        isEditing
          ? "✅ Server Updated Successfully"
          : "✅ Server Added Successfully"
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- DELETE SERVER ---------------- */
  const deleteServer = async (index) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/delete-server/${index}`,
        {
          method: "DELETE"
        }
      );

      fetchStats();
      showToast("🗑 Server Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();

      const interval = setInterval(() => {
        fetchStats();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  /* ---------------- ALERTS ---------------- */
  const alerts = [];

  if (data.cpu > 80)
    alerts.push(`⚠ High CPU Usage: ${data.cpu}%`);

  if (data.ram > 85)
    alerts.push(`⚠ High RAM Usage: ${data.ram}%`);

  if (data.disk > 90)
    alerts.push(
      `⚠ Disk Almost Full: ${data.disk}%`
    );

  if (data.database_status !== "Running")
    alerts.push("❌ PostgreSQL Offline");

  const cardStyle = {
    background: "rgba(255,255,255,0.06)",
    padding: "25px",
    borderRadius: "20px",
    width: "240px",
    color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    backdropFilter: "blur(10px)"
  };

  const valueStyle = {
    fontSize: "34px",
    fontWeight: "bold",
    marginTop: "10px"
  };

  /* ---------------- LOGIN SCREEN ---------------- */
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg,#0f172a,#111827,#1e293b)"
        }}
      >
        <div
          style={{
            width: "380px",
            padding: "35px",
            borderRadius: "18px",
            background:
              "rgba(255,255,255,0.08)",
            color: "white"
          }}
        >
          <h1>🔐 SmartDB Login</h1>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              marginBottom: "15px"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px"
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px",
              background:
                "linear-gradient(90deg,#3b82f6,#2563eb)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Login
          </button>

          {loginError && (
            <p
              style={{
                color: "red",
                marginTop: "15px"
              }}
            >
              {loginError}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background:
              "linear-gradient(90deg,#22c55e,#16a34a)",
            color: "white",
            padding: "14px 22px",
            borderRadius: "12px",
            fontWeight: "bold",
            zIndex: 9999,
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.25)"
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{
          minHeight: "100vh",
          padding: "40px",
          background:
            "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
          color: "white"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "30px"
          }}
        >
          <div>
            <h1>🚀 SmartDB Pro Dashboard</h1>
            <p>Secure JWT Login Enabled</p>
          </div>

          <button
            onClick={logout}
            style={{
              padding: "10px 18px",
              background:
                "linear-gradient(90deg,#ef4444,#dc2626)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </div>

        {!loading && (
          <div
            style={{
              marginBottom: "25px",
              padding: "18px",
              borderRadius: "14px",
              background:
                alerts.length > 0
                  ? "rgba(239,68,68,0.18)"
                  : "rgba(34,197,94,0.18)"
            }}
          >
            <h3>
              {alerts.length > 0
                ? "🚨 Alerts"
                : "✅ Healthy"}
            </h3>

            {alerts.length > 0 ? (
              alerts.map((a, i) => (
                <p key={i}>{a}</p>
              ))
            ) : (
              <p>All systems normal.</p>
            )}
          </div>
        )}

        {/* ADD SERVER */}
        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            padding: "20px",
            borderRadius: "18px",
            marginBottom: "30px"
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>
            {isEditing
              ? "✏ Edit Server"
              : "➕ Add New Server"}
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            <input
              placeholder="Server Name"
              value={serverName}
              onChange={(e) =>
                setServerName(e.target.value)
              }
              style={{ padding: "10px" }}
            />

            <input
              placeholder="Host"
              value={serverHost}
              onChange={(e) =>
                setServerHost(e.target.value)
              }
              style={{ padding: "10px" }}
            />

            <input
              placeholder="Port"
              value={serverPort}
              onChange={(e) =>
                setServerPort(e.target.value)
              }
              style={{ padding: "10px" }}
            />

            <button
              onClick={addServer}
              style={{
                padding: "10px 18px",
                background: isEditing
                  ? "linear-gradient(90deg,#3b82f6,#2563eb)"
                  : "linear-gradient(90deg,#22c55e,#16a34a)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {isEditing
                ? "Update Server"
                : "Add Server"}
            </button>
          </div>
        </div>

        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: "25px",
                flexWrap: "wrap",
                marginBottom: "40px"
              }}
            >
              <div style={cardStyle}>
                <h3>CPU</h3>
                <div style={valueStyle}>
                  {data.cpu}%
                </div>
              </div>

              <div style={cardStyle}>
                <h3>RAM</h3>
                <div style={valueStyle}>
                  {data.ram}%
                </div>
              </div>

              <div style={cardStyle}>
                <h3>Disk</h3>
                <div style={valueStyle}>
                  {data.disk}%
                </div>
              </div>

              <div style={cardStyle}>
                <h3>Database</h3>
                <div style={valueStyle}>
                  {data.database_status}
                </div>
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="cpu"
                  stroke="#3b82f6"
                />
                <Line
                  dataKey="ram"
                  stroke="#22c55e"
                />
                <Line
                  dataKey="disk"
                  stroke="#f59e0b"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* SERVER LIST */}
            <div
              style={{
                marginTop: "35px",
                background:
                  "rgba(255,255,255,0.08)",
                padding: "25px",
                borderRadius: "18px"
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>
                🖥 Live Server Monitoring
              </h2>

              {data.servers.map(
                (server, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      padding: "14px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    <div>
                      <h4>{server.name}</h4>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#cbd5e1"
                        }}
                      >
                        {server.host}:{server.port}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems:
                          "center"
                      }}
                    >
                      <div
                        style={{
                          color:
                            server.status ===
                            "Running"
                              ? "#22c55e"
                              : "#ef4444",
                          fontWeight:
                            "bold"
                        }}
                      >
                        {server.status}
                      </div>

                      <button
                        onClick={() => {
                          setServerName(
                            server.name || ""
                          );
                          setServerHost(
                            server.host || ""
                          );
                          setServerPort(
                            String(
                              server.port || ""
                            )
                          );
                          setEditIndex(index);
                          setIsEditing(true);

                          window.scrollTo({
                            top: 0,
                            behavior:
                              "smooth"
                          });
                        }}
                        style={{
                          background:
                            "#3b82f6",
                          color: "white",
                          border: "none",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer"
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteServer(index)
                        }
                        style={{
                          background:
                            "#ef4444",
                          color: "white",
                          border: "none",
                          padding:
                            "6px 10px",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;