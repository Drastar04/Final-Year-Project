const DashboardSection = () => {
  const stats = [
    {
      title: "Total Applications",
      value: "12",
      change: "+3 this month",
      color: "#3b82f6",
    },
    {
      title: "Scholarships Found",
      value: "45",
      change: "+8 new matches",
      color: "#10b981",
    },
    {
      title: "Deadlines This Week",
      value: "3",
      change: "Action required",
      color: "#f59e0b",
    },
    {
      title: "Success Rate",
      value: "25%",
      change: "+5% improvement",
      color: "#8b5cf6",
    },
  ]

  const recentActivity = [
    { action: "Applied to Merit Scholarship", time: "2 hours ago", status: "submitted" },
    { action: "New scholarship match found", time: "1 day ago", status: "new" },
    { action: "Application deadline reminder", time: "2 days ago", status: "reminder" },
    { action: "Profile updated", time: "3 days ago", status: "completed" },
  ]

  return (
    <div style={{ padding: "0" }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
          Welcome back! 👋
        </h2>
        <p style={{ color: "#6b7280" }}>
          Here's what's happening with your scholarship journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>{stat.title}</h3>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: stat.color,
                }}
              ></div>
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "0.5rem",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#10b981" }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Recent Activity</h3>
        </div>
        <div style={{ padding: "1rem" }}>
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: index < recentActivity.length - 1 ? "0.5rem" : "0",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    activity.status === "new"
                      ? "#10b981"
                      : activity.status === "reminder"
                      ? "#f59e0b"
                      : "#6b7280",
                  marginRight: "1rem",
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#111827" }}>
                  {activity.action}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardSection
