import { useEffect, useState } from "react";
import { api, setAuthToken } from "./api";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import FeedingPointsMap from "./components/FeedingPointsMap";
import ScheduleBoard from "./components/ScheduleBoard";
import AlertsPanel from "./components/AlertsPanel";
import VolunteersPanel from "./components/VolunteersPanel";
import AuthPanel from "./components/AuthPanel";

const App = () => {
  const [feedingPoints, setFeedingPoints] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [pointsRes, schedulesRes, alertsRes, volunteersRes] = await Promise.all([
        api.getFeedingPoints(),
        api.getSchedules(),
        api.getAlerts(),
        api.getVolunteers(),
      ]);

      setFeedingPoints(pointsRes);
      setSchedules(schedulesRes);
      setAlerts(alertsRes);
      setVolunteers(volunteersRes);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem("streetDogsToken");
      if (!token) return;
      setAuthToken(token);

      try {
        const me = await api.me();
        setUser(me);
      } catch {
        setAuthToken("");
      }
    };

    bootstrapAuth();
    loadDashboard();
  }, []);

  return (
    <div className="page-wrap">
      <Header />
      {error && <p className="error-banner">{error}</p>}

      <main className="dashboard-grid">
        <AuthPanel user={user} setUser={setUser} />

        <DashboardStats
          feedingPoints={feedingPoints}
          schedules={schedules}
          alerts={alerts}
          volunteers={volunteers}
        />

        <FeedingPointsMap feedingPoints={feedingPoints} onRefresh={loadDashboard} />

        <ScheduleBoard
          schedules={schedules}
          feedingPoints={feedingPoints}
          volunteers={volunteers}
          onRefresh={loadDashboard}
        />

        <AlertsPanel alerts={alerts} feedingPoints={feedingPoints} onRefresh={loadDashboard} />

        <VolunteersPanel volunteers={volunteers} onRefresh={loadDashboard} />
      </main>

      {loading && <div className="loading-overlay">Loading dashboard...</div>}
    </div>
  );
};

export default App;
