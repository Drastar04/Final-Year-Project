"use client"

import { useState, useEffect } from "react"

const SettingsPage = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const storedUser = localStorage.getItem("user")
  const token = storedUser ? JSON.parse(storedUser).token : null
  // Fetch settings from backend on mount
  useEffect(() => {
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }

    fetch("/api/user-settings/", {
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch settings")
        return res.json()
      })
      .then((data) => {
        // Assuming backend sends { data: {notifications:..., privacy:..., ...} }
        setSettings(data.data || data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [token])

  // Update local state on toggle/select change
  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))
  }

  // Save settings to backend
  const handleSave = () => {
    if (!token) {
      setError("Not authenticated")
      return
    }
    setError(null)

    fetch("/api/user-settings/", {
      method: "PUT",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: settings }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save settings")
        alert("Settings saved successfully!")
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  // Reset to defaults (hardcoded or you can fetch default from backend)
  const handleReset = () => {
    setSettings({
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        deadlineReminders: true,
        applicationUpdates: true,
        weeklyDigest: false,
      },
      privacy: {
        profileVisibility: "private",
        shareAchievements: false,
        allowMessages: true,
      },
      preferences: {
        theme: "light",
        language: "english",
        timezone: "EST",
        currency: "USD",
      },
      account: {
        twoFactorAuth: false,
        loginAlerts: true,
      },
    })
  }

  // Reuse your ToggleSwitch component here
  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0" }}>
      <span style={{ fontSize: "0.875rem", color: "#374151" }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "48px",
          height: "24px",
          backgroundColor: checked ? "#10b981" : "#d1d5db",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background-color 0.2s",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
            position: "absolute",
            top: "2px",
            left: checked ? "26px" : "2px",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        ></div>
      </button>
    </div>
  )

  if (loading) return <p>Loading settings...</p>
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>
  if (!settings) return null

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>Settings ⚙️</h2>
        <p style={{ color: "#6b7280" }}>Customize your Scholify experience and manage your account preferences.</p>
      </div>

      <div style={{ display: "grid", gap: "2rem" }}>
        {/* Notification Settings */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
              Notifications
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Choose how you want to be notified about important updates.
            </p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} style={{ borderBottom: key !== "weeklyDigest" ? "1px solid #f3f4f6" : undefined }}>
                <ToggleSwitch
                  checked={value}
                  onChange={(val) => handleSettingChange("notifications", key, val)}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .replace("Email Notifications", "Email Notifications")
                    .replace("Push Notifications", "Push Notifications")
                    .replace("Deadline Reminders", "Deadline Reminders")
                    .replace("Application Updates", "Application Status Updates")
                    .replace("Weekly Digest", "Weekly Digest Email")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
              Privacy & Security
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Control your privacy settings and data sharing preferences.
            </p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Profile Visibility
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  backgroundColor: "white",
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <div style={{ borderBottom: "1px solid #f3f4f6" }}>
              <ToggleSwitch
                checked={settings.privacy.shareAchievements}
                onChange={(value) => handleSettingChange("privacy", "shareAchievements", value)}
                label="Share Achievements Publicly"
              />
            </div>
            <div>
              <ToggleSwitch
                checked={settings.privacy.allowMessages}
                onChange={(value) => handleSettingChange("privacy", "allowMessages", value)}
                label="Allow Messages from Other Users"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
              Preferences
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Customize your app experience and display settings.
            </p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Theme
                </label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handleSettingChange("preferences", "theme", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Language
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange("preferences", "language", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Timezone
                </label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => handleSettingChange("preferences", "timezone", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Currency
                </label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => handleSettingChange("preferences", "currency", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white",
                  }}
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
              Account Security
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Manage your account security and authentication settings.
            </p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div style={{ borderBottom: "1px solid #f3f4f6" }}>
              <ToggleSwitch
                checked={settings.account.twoFactorAuth}
                onChange={(value) => handleSettingChange("account", "twoFactorAuth", value)}
                label="Two-Factor Authentication"
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <ToggleSwitch
                checked={settings.account.loginAlerts}
                onChange={(value) => handleSettingChange("account", "loginAlerts", value)}
                label="Login Alerts"
              />
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
                // Implement change password functionality if backend supports
                onClick={() => alert("Change Password clicked")}
              >
                Change Password
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
                // Implement download data functionality if backend supports
                onClick={() => alert("Download Data clicked")}
              >
                Download Data
              </button>
              <button
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                // Implement delete account functionality if backend supports
                onClick={() => alert("Delete Account clicked")}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "1rem 2rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Save All Changes
          </button>
          <button
            onClick={handleReset}
            style={{
              backgroundColor: "transparent",
              color: "#6b7280",
              padding: "1rem 2rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
