"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardOverview from "../components/DashboardOverview.jsx"
import FindScholarships from "../components/FindScholarships.jsx"
import MyApplications from "../components/MyApplications.jsx"
import CalendarPage from "../components/CalendarPage.jsx"
import ProfilePage from "../components/ProfilePage.jsx"
import SettingsPage from "../components/SettingsPage.jsx"
import "./DashboardPage.css"  // Use your preferred CSS filename

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
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

  const navigationItems = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: "📊",
      component: () => (
        <DashboardOverview
          bookmarkedScholarships={bookmarkedScholarships}
          recommendations={recommendations}
        />
      ),
    },
    {
      id: "scholarships",
      label: "Find Scholarships",
      icon: "🔍",
      component: FindScholarships,
    },
    {
      id: "applications",
      label: "My Applications",
      icon: "📝",
      component: MyApplications,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: "📅",
      component: CalendarPage,
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      component: () => <ProfilePage user={user} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      component: SettingsPage,
    },
  ]

  const ActiveComponent =
    navigationItems.find((item) => item.id === activeTab)?.component || (() => <DashboardOverview />)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>🎓 Scholify</h2>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "nav-item-active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? "main-content-expanded" : "main-content-full"}`}>
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <h1 className="page-title">
              {navigationItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{user?.username || "Student"}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          <ActiveComponent />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
