import { useState, useEffect } from "react"

const ProfilePage = ({ user }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  })

  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token
    if (!token) return

    fetch("http://localhost:8000/api/auth/user/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        })
      })
      .catch((err) => console.error("Failed to fetch profile", err))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = JSON.parse(localStorage.getItem("user"))?.token
    if (!token) return

    try {
      const res = await fetch("http://localhost:8000/api/auth/user/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      setMessage("Profile updated successfully.")
      setEditMode(false)
    } catch (err) {
      console.error("Update failed", err)
      setMessage("Something went wrong.")
    }
  }

  if (loading) return <p>Loading profile...</p>

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>My Profile 👤</h2>

      {message && <p style={{ marginTop: "1rem", color: "#10b981" }}>{message}</p>}

      {editMode ? (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Username:</label><br />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email:</label><br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>First Name:</label><br />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              style={{ padding: "0.5rem", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Last Name:</label><br />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              style={{ padding: "0.5rem", width: "100%" }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              marginRight: "1rem",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div style={{ marginTop: "1rem", lineHeight: "1.8" }}>
          <p><strong>Username:</strong> {formData.username}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>First Name:</strong> {formData.first_name}</p>
          <p><strong>Last Name:</strong> {formData.last_name}</p>
          <button
            onClick={() => setEditMode(true)}
            style={{
              marginTop: "1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
            }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
