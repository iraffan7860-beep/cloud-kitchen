import { useState } from "react";

const API_URL = "http://localhost:5000/api";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      const token = data.token || data.data?.token;

      if (!token) {
        throw new Error("Login token was not received.");
      }

      localStorage.setItem("fc-admin-token", token);
      onLogin?.(token);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.heading}>FC Kitchen</h1>
        <p style={styles.subtitle}>Admin Login</p>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login to Dashboard"}
        </button>
      </form>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#17110e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#241a14",
    padding: "35px",
    border: "1px solid #9e7b42",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    color: "#e4c98c",
    textAlign: "center",
    fontFamily: "Georgia, serif",
    margin: "0",
  },
  subtitle: {
    color: "#eee0c9",
    textAlign: "center",
    marginBottom: "25px",
  },
  label: {
    color: "#e4c98c",
    marginBottom: "8px",
  },
  input: {
    padding: "13px",
    marginBottom: "18px",
    border: "1px solid #80643e",
    borderRadius: "6px",
    background: "#17110e",
    color: "#fff",
    outline: "none",
  },
  button: {
    padding: "14px",
    background: "#c6a15b",
    color: "#17110e",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    background: "#512323",
    color: "#ffdada",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default AdminLogin;