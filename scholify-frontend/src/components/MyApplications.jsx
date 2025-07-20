"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const MyApplications = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get token from localStorage (adjust if you store differently)
    const storedUser = localStorage.getItem("user")
    const token = storedUser ? JSON.parse(storedUser).token : null

    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    fetch("http://localhost:8000/api/my-applications/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications")
        return res.json()
      })
      .then((data) => {
        // Assuming API returns an array of applications
        setApplications(data.applications || data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return { bg: "#dcfce7", text: "#166534" }
      case "submitted":
        return { bg: "#dbeafe", text: "#1d4ed8" }
      case "in-progress":
        return { bg: "#fef3c7", text: "#92400e" }
      case "draft":
        return { bg: "#f3f4f6", text: "#374151" }
      case "rejected":
        return { bg: "#fee2e2", text: "#dc2626" }
      default:
        return { bg: "#f3f4f6", text: "#374151" }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return "✅"
      case "submitted":
        return "📤"
      case "in-progress":
        return "⏳"
      case "draft":
        return "📝"
      case "rejected":
        return "❌"
      default:
        return "📄"
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true
    return app.status === activeTab
  })

  const tabs = [
    { id: "all", label: "All Applications", count: applications.length },
    { id: "draft", label: "Drafts", count: applications.filter((app) => app.status === "draft").length },
    {
      id: "in-progress",
      label: "In Progress",
      count: applications.filter((app) => app.status === "in-progress").length,
    },
    { id: "submitted", label: "Submitted", count: applications.filter((app) => app.status === "submitted").length },
    { id: "accepted", label: "Accepted", count: applications.filter((app) => app.status === "accepted").length },
  ]

  if (loading) return <p>Loading applications...</p>
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
          My Applications 📝
        </h2>
        <p style={{ color: "#6b7280" }}>Track and manage your scholarship applications.</p>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "1rem 1.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: activeTab === tab.id ? "#2563eb" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {tab.label}
              <span
                style={{
                  backgroundColor: activeTab === tab.id ? "#dbeafe" : "#f3f4f6",
                  color: activeTab === tab.id ? "#1d4ed8" : "#6b7280",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {filteredApplications.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No applications found for this category.</p>
        ) : (
          filteredApplications.map((application) => {
            const statusStyle = getStatusColor(application.status)
            return (
              <div
                key={application.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{application.title}</h3>
                      <span
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace("-", " ")}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#059669" }}>
                        {application.amount}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        Deadline: {new Date(application.deadline).toLocaleDateString()}
                      </span>
                      {application.submittedDate && (
                        <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Progress</span>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{application.progress}%</span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${application.progress}%`,
                        height: "100%",
                        backgroundColor: application.progress === 100 ? "#10b981" : "#3b82f6",
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Next Step */}
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>Next Step:</span>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280", marginLeft: "0.5rem" }}>
                    {application.nextStep}
                  </span>
                </div>

                {/* Documents */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                    Documents:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {application.documents.map((doc, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#f0f9ff",
                          color: "#0369a1",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                        }}
                      >
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "1rem" }}>
                  {application.status === "draft" || application.status === "in-progress" ? (
                    <>
                      <button
                        style={{
                          backgroundColor: "#2563eb",
                          color: "white",
                          padding: "0.75rem 1.5rem",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // TODO: Navigate to edit application page
                          alert(`Continue application ${application.title}`)
                        }}
                      >
                        Continue Application
                      </button>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          color: "#6b7280",
                          padding: "0.75rem 1.5rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // TODO: Navigate to view details page
                          alert(`View details for ${application.title}`)
                        }}
                      >
                        View Details
                      </button>
                    </>
                  ) : (
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "#6b7280",
                        padding: "0.75rem 1.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        // TODO: Navigate to view application page
                        alert(`View application ${application.title}`)
                      }}
                    >
                      View Application
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyApplications
