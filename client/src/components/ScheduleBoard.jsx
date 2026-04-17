import { useState } from "react";
import { api } from "../api";

const ScheduleBoard = ({ schedules, feedingPoints, volunteers, onRefresh }) => {
  const [formData, setFormData] = useState({
    feedingPoint: "",
    feedingDate: "",
    mealType: "Mixed",
    assignedVolunteer: "",
  });

  const submitSchedule = async (event) => {
    event.preventDefault();
    try {
      await api.addSchedule({
        ...formData,
        assignedVolunteer: formData.assignedVolunteer || null,
      });
      setFormData({ feedingPoint: "", feedingDate: "", mealType: "Mixed", assignedVolunteer: "" });
      await onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.updateScheduleStatus(id, status);
      await onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="panel">
      <h2>Daily Feeding Schedule</h2>

      <form className="inline-form" onSubmit={submitSchedule}>
        <select
          value={formData.feedingPoint}
          onChange={(e) => setFormData((prev) => ({ ...prev, feedingPoint: e.target.value }))}
          required
        >
          <option value="">Select feeding point</option>
          {feedingPoints.map((point) => (
            <option key={point._id} value={point._id}>
              {point.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={formData.feedingDate}
          onChange={(e) => setFormData((prev) => ({ ...prev, feedingDate: e.target.value }))}
          required
        />

        <select
          value={formData.mealType}
          onChange={(e) => setFormData((prev) => ({ ...prev, mealType: e.target.value }))}
        >
          <option>Mixed</option>
          <option>Dry Food</option>
          <option>Wet Food</option>
          <option>Water</option>
        </select>

        <select
          value={formData.assignedVolunteer}
          onChange={(e) => setFormData((prev) => ({ ...prev, assignedVolunteer: e.target.value }))}
        >
          <option value="">Assign volunteer (optional)</option>
          {volunteers.map((volunteer) => (
            <option key={volunteer._id} value={volunteer._id}>
              {volunteer.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Schedule</button>
      </form>

      <ul className="list-cards">
        {schedules.map((item) => (
          <li key={item._id}>
            <p>
              <strong>{item.feedingPoint?.name || "Unknown Point"}</strong> - {item.mealType}
            </p>
            <p>{new Date(item.feedingDate).toLocaleString()}</p>
            <p>Status: {item.status}</p>
            <div className="action-row">
              <button onClick={() => updateStatus(item._id, "completed")}>Mark Completed</button>
              <button className="muted-btn" onClick={() => updateStatus(item._id, "missed")}>
                Mark Missed
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ScheduleBoard;
