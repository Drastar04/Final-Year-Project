import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./DashboardPage.css"

const DashboardPage = () => {
  const [user, setUser] = useState(null)
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("bookmarks")
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
        <button
          className={activeTab === "bookmarks" ? "active" : ""}
          onClick={() => setActiveTab("bookmarks")}
        >
          Bookmarked Scholarships
        </button>
        <button
          className={activeTab === "recommendations" ? "active" : ""}
          onClick={() => setActiveTab("recommendations")}
        >
          Recommendations
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "bookmarks" && (
          <ul>
            {bookmarkedScholarships.length > 0 ? (
              bookmarkedScholarships.map((scholarship) => (
                <li key={scholarship.id}>
                  <strong>{scholarship.title}</strong> — {scholarship.amount}
                </li>
              ))
            ) : (
              <p>No bookmarks yet.</p>
            )}
          </ul>
        )}

        {activeTab === "recommendations" && (
          <ul>
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <li key={rec.id}>
                  <strong>{rec.title}</strong> — {rec.amount}
                </li>
              ))
            ) : (
              <p>No recommendations yet.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
