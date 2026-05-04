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
    database_status: "Checking..."
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
    background: "rgba(255,255,255,0.08)",
    padding: "25px",
    borderRadius: "18px",
    width: "240px",
    color: "white"
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
              background: "#3b82f6",
              color: "white",
              border: "none",
              cursor: "pointer"
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
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        color: "white"
      }}
    >
      {/* Header */}
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
          <p>
            Secure JWT Login Enabled
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "10px 18px",
            background: "#ef4444",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Alerts */}
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

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {/* Cards */}
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

          {/* Chart */}
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
        </>
      )}
    </div>
  );
}

export default App;