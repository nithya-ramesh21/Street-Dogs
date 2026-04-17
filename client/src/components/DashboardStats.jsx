const DashboardStats = ({ feedingPoints, schedules, alerts, volunteers }) => {
  const openAlerts = alerts.filter((alert) => alert.status !== "resolved").length;
  const plannedToday = schedules.filter((schedule) => {
    const today = new Date().toDateString();
    return new Date(schedule.feedingDate).toDateString() === today;
  }).length;
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.active).length;

  return (
    <section className="panel stats-panel">
      <h2>Live Snapshot</h2>
      <div className="stats-grid">
        <article>
          <p>Feeding Points</p>
          <strong>{feedingPoints.length}</strong>
        </article>
        <article>
          <p>Meals Planned Today</p>
          <strong>{plannedToday}</strong>
        </article>
        <article>
          <p>Open Alerts</p>
          <strong>{openAlerts}</strong>
        </article>
        <article>
          <p>Active Volunteers</p>
          <strong>{activeVolunteers}</strong>
        </article>
      </div>
    </section>
  );
};

export default DashboardStats;
