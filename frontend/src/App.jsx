function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🚀 SmartDB Pro</h1>
      <p>AI Powered MySQL Optimization Platform</p>

      <hr />

      <h2>Dashboard</h2>

      <div style={{ marginTop: "20px" }}>
        <p>✅ Servers Connected: 0</p>
        <p>✅ Health Score: Good</p>
        <p>✅ Benchmarks Run: 0</p>
        <p>✅ AI Suggestions Ready</p>
      </div>

      <button style={{
        padding: "10px 20px",
        marginTop: "20px",
        cursor: "pointer"
      }}>
        Add Server
      </button>
    </div>
  );
}
export default App;