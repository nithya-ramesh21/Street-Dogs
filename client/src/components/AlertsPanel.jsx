import { useState } from "react";
import { api } from "../api";

const AlertsPanel = ({ alerts, feedingPoints, onRefresh }) => {
  const [formData, setFormData] = useState({
    type: "health",
    severity: "medium",
    feedingPoint: "",
    description: "",
    image: null,
  });

  const submitAlert = async (event) => {
    event.preventDefault();
    try {
      await api.addAlert({ ...formData, feedingPoint: formData.feedingPoint || null });
      setFormData({ type: "health", severity: "medium", feedingPoint: "", description: "", image: null });
      event.target.reset();
      await onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateAlertStatus(id, status);
      await onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="panel">
      <h2>Health Alerts & Rescue Requests</h2>

      <form className="inline-form" onSubmit={submitAlert}>
        <select value={formData.type} onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}>
          <option value="health">Health</option>
          <option value="rescue">Rescue</option>
        </select>

        <select
          value={formData.severity}
          onChange={(e) => setFormData((prev) => ({ ...prev, severity: e.target.value }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={formData.feedingPoint}
          onChange={(e) => setFormData((prev) => ({ ...prev, feedingPoint: e.target.value }))}
        >
          <option value="">Point (optional)</option>
          {feedingPoints.map((point) => (
            <option key={point._id} value={point._id}>
              {point.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Describe issue"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
        />

        <input type="file" accept="image/*" onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }))} />

        <button type="submit">Raise Alert</button>
      </form>

      <ul className="list-cards">
        {alerts.map((alert) => (
          <li key={alert._id} className={`alert-${alert.severity}`}>
            <p>
              <strong>{alert.type.toUpperCase()}</strong> - {alert.severity.toUpperCase()}
            </p>
            <p>{alert.description}</p>
            {alert.imageUrl && (
              <img
                className="alert-image"
                src={
                  alert.imageUrl.startsWith("data:")
                    ? alert.imageUrl
                    : `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${alert.imageUrl}`
                }
                alt="Alert evidence"
              />
            )}
            <p>Status: {alert.status}</p>
            <div className="action-row">
              <button onClick={() => updateStatus(alert._id, "in-progress")}>In Progress</button>
              <button className="muted-btn" onClick={() => updateStatus(alert._id, "resolved")}>
                Resolve
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AlertsPanel;
