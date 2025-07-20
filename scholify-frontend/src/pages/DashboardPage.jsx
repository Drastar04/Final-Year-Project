// src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./DashboardPage.css"

import DashboardSection from "../components/DashboardOverview"
import FindScholarshipsSection from "../components/FindScholarships"
import MyApplicationsSection from "../components/MyApplications"
import CalendarSection from "../components/CalendarPage"
import ProfileSection from "../components/ProfilePage"
import SettingsSection from "../components/SettingsPage"

const DashboardPage = () => {
  const [user, setUser] = useState(null)
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const navigate = useNavigate()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"))

    if (!userData || !userData.token) {
      navigate("/login")
      return
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${userData.token}`,
    }

    const fetchDashboardData = async () => {
      try {
        const [userRes, bookmarkRes, recRes] = await Promise.all([
          fetch("http://localhost:8000/api/auth/user/", { headers }),
          fetch("http://localhost:8000/api/dashboard/bookmarks/", { headers }),
          fetch("http://localhost:8000/api/dashboard/recommendations/", { headers }),
        ])

        if (!userRes.ok || !bookmarkRes.ok || !recRes.ok) {
          throw new Error("Unauthorized")
        }

        const userData = await userRes.json()
        const bookmarkData = await bookmarkRes.json()
        const recData = await recRes.json()

        setUser(userData)
        setBookmarkedScholarships(bookmarkData)
        setRecommendations(recData)
      } catch (err) {
        console.error("Error loading dashboard:", err)
        localStorage.removeItem("user")
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <h2>Welcome, {user?.username || "User"}</h2>

      <div className="dashboard-tabs">
        {["dashboard", "find", "applications", "calendar", "profile", "settings"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "dashboard"
              ? "Dashboard"
              : tab === "find"
              ? "Find Scholarships"
              : tab === "applications"
              ? "My Applications"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === "dashboard" && (
          <DashboardSection
            bookmarkedScholarships={bookmarkedScholarships}
            recommendations={recommendations}
          />
        )}
        {activeTab === "find" && <FindScholarshipsSection />}
        {activeTab === "applications" && <MyApplicationsSection />}
        {activeTab === "calendar" && <CalendarSection />}
        {activeTab === "profile" && <ProfileSection user={user} />}
        {activeTab === "settings" && <SettingsSection />}
      </div>
    </div>
  )
}

export default DashboardPage
