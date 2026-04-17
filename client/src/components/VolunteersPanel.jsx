import { useState } from "react";
import { api } from "../api";

const VolunteersPanel = ({ volunteers, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    availability: "",
  });

  const submitVolunteer = async (event) => {
    event.preventDefault();
    try {
      await api.addVolunteer({
        ...formData,
        availability: formData.availability
          .split(",")
          .map((slot) => slot.trim())
          .filter(Boolean),
      });
      setFormData({ name: "", phone: "", area: "", availability: "" });
      await onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.toggleVolunteerStatus(id);
      await onRefresh();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="panel panel-wide">
      <h2>Volunteer Coordination</h2>

      <form className="inline-form" onSubmit={submitVolunteer}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          required
        />
        <input
          placeholder="Area"
          value={formData.area}
          onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
          required
        />
        <input
          placeholder="Availability (morning, evening)"
          value={formData.availability}
          onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value }))}
        />
        <button type="submit">Add Volunteer</button>
      </form>

      <ul className="list-cards two-col">
        {volunteers.map((volunteer) => (
          <li key={volunteer._id}>
            <p>
              <strong>{volunteer.name}</strong> ({volunteer.phone})
            </p>
            <p>Area: {volunteer.area}</p>
            <p>
              Availability: {volunteer.availability?.length ? volunteer.availability.join(", ") : "N/A"}
            </p>
            <p>Status: {volunteer.active ? "Active" : "Inactive"}</p>
            <button className="muted-btn" onClick={() => toggleStatus(volunteer._id)}>
              Toggle Status
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VolunteersPanel;
