import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { api } from "../api";

const defaultCenter = [12.9716, 77.5946];

const FeedingPointsMap = ({ feedingPoints, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    lat: "",
    lng: "",
    address: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  const mapCenter = useMemo(() => {
    if (!feedingPoints.length) return defaultCenter;
    return [feedingPoints[0].location.lat, feedingPoints[0].location.lng];
  }, [feedingPoints]);

  const submitPoint = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.addFeedingPoint(formData);
      setFormData({ name: "", lat: "", lng: "", address: "", notes: "" });
      await onRefresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel panel-wide">
      <h2>Map Feeding Points</h2>
      <div className="map-wrap">
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom className="map-box">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {feedingPoints.map((point) => (
            <Marker key={point._id} position={[point.location.lat, point.location.lng]}>
              <Popup>
                <strong>{point.name}</strong>
                <br />
                {point.location.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <form className="inline-form" onSubmit={submitPoint}>
        <input
          placeholder="Point name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          placeholder="Latitude"
          value={formData.lat}
          onChange={(e) => setFormData((prev) => ({ ...prev, lat: e.target.value }))}
          required
        />
        <input
          placeholder="Longitude"
          value={formData.lng}
          onChange={(e) => setFormData((prev) => ({ ...prev, lng: e.target.value }))}
          required
        />
        <input
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          required
        />
        <input
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />
        <button type="submit" disabled={busy}>
          {busy ? "Saving..." : "Add Point"}
        </button>
      </form>
    </section>
  );
};

export default FeedingPointsMap;
