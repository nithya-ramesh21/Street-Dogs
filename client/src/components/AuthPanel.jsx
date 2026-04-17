import { useState } from "react";
import { api, setAuthToken } from "../api";

const AuthPanel = ({ user, setUser }) => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response =
        mode === "register"
          ? await api.register(formData)
          : await api.login({ email: formData.email, password: formData.password });

      setAuthToken(response.token);
      setUser({
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => {
    setAuthToken("");
    setUser(null);
  };

  if (user) {
    return (
      <section className="panel auth-panel">
        <p>
          Signed in as <strong>{user.name}</strong> ({user.role})
        </p>
        <button className="muted-btn" onClick={logout}>
          Logout
        </button>
      </section>
    );
  }

  return (
    <section className="panel auth-panel">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <form className="inline-form" onSubmit={submit}>
        {mode === "register" && (
          <input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        {mode === "register" && (
          <select value={formData.role} onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
      </form>

      <button className="link-btn" onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}>
        {mode === "login" ? "Need an account? Register" : "Already registered? Login"}
      </button>
    </section>
  );
};

export default AuthPanel;
