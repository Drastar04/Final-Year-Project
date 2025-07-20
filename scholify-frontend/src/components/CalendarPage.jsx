"use client"

import { useState } from "react"

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    type: "deadline",
    description: "",
    amount: "",
    requirements: "",
    priority: "medium",
  })

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Merit Excellence Scholarship",
      date: "2024-03-15",
      type: "deadline",
      time: "11:59 PM",
      description: "Final submission deadline for Merit Excellence Scholarship",
      amount: "$5,000",
      requirements: "GPA 3.5+, Essay, Transcripts",
      priority: "high",
      isCustom: false,
    },
    {
      id: 2,
      title: "STEM Grant Application Due",
      date: "2024-04-01",
      type: "deadline",
      time: "11:59 PM",
      description: "Submit all required documents for STEM Innovation Grant",
      amount: "$3,000",
      requirements: "STEM major, Research proposal",
      priority: "high",
      isCustom: false,
    },
    {
      id: 3,
      title: "Scholarship Interview",
      date: "2024-03-20",
      type: "interview",
      time: "2:00 PM",
      description: "Virtual interview for Community Service Award",
      amount: "$2,500",
      requirements: "Interview preparation",
      priority: "medium",
      isCustom: false,
    },
    {
      id: 4,
      title: "Document Submission",
      date: "2024-03-25",
      type: "task",
      time: "5:00 PM",
      description: "Submit recommendation letters for Leadership Scholarship",
      amount: "",
      requirements: "2 recommendation letters",
      priority: "medium",
      isCustom: false,
    },
  ])

  const getEventColor = (type) => {
    switch (type) {
      case "deadline":
        return { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" }
      case "interview":
        return { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" }
      case "task":
        return { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" }
      case "meeting":
        return { bg: "#dcfce7", text: "#166534", border: "#86efac" }
      case "scholarship":
        return { bg: "#f3e8ff", text: "#7c3aed", border: "#c4b5fd" }
      default:
        return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" }
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "deadline":
        return "⏰"
      case "interview":
        return "🎤"
      case "task":
        return "📋"
      case "meeting":
        return "👥"
      case "scholarship":
        return "🎓"
      default:
        return "📅"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const handleAddEvent = () => {
    setFormData({
      title: "",
      date: selectedDate
        ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
        : "",
      time: "",
      type: "deadline",
      description: "",
      amount: "",
      requirements: "",
      priority: "medium",
    })
    setEditingEvent(null)
    setShowAddEventModal(true)
  }

  const handleEditEvent = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description,
      amount: event.amount || "",
      requirements: event.requirements || "",
      priority: event.priority || "medium",
    })
    setEditingEvent(event)
    setShowAddEventModal(true)
  }

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId))
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.time) {
      alert("Please fill in all required fields")
      return
    }

    const eventData = {
      ...formData,
      id: editingEvent ? editingEvent.id : Date.now(),
      isCustom: true,
    }

    if (editingEvent) {
      setEvents(events.map((event) => (event.id === editingEvent.id ? eventData : event)))
    } else {
      setEvents([...events, eventData])
    }

    setShowAddEventModal(false)
    setFormData({
      title: "",
      date: "",
      time: "",
      type: "deadline",
      description: "",
      amount: "",
      requirements: "",
      priority: "medium",
    })
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Keep all the existing calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const hasEvent = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.some((event) => event.date === dateStr)
  }

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: "1rem" }}></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day)
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(day)}
          style={{
            padding: "0.5rem",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: isToday(day)
              ? "#dbeafe"
              : selectedDate === day
                ? "#e0e7ff"
                : hasEvent(day)
                  ? "#fef3c7"
                  : "transparent",
            border: isToday(day) ? "2px solid #3b82f6" : "2px solid transparent",
            minHeight: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            transition: "all 0.2s",
          }}
        >
          <span
            style={{
              fontWeight: isToday(day) ? "700" : "500",
              color: isToday(day) ? "#1d4ed8" : "#374151",
              marginBottom: "0.25rem",
            }}
          >
            {day}
          </span>
          {dayEvents.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", justifyContent: "center" }}>
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: getEventColor(event.type).text,
                  }}
                ></div>
              ))}
              {dayEvents.length > 2 && (
                <span style={{ fontSize: "0.625rem", color: "#6b7280" }}>+{dayEvents.length - 2}</span>
              )}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827" }}>Calendar 📅</h2>
          <button
            onClick={handleAddEvent}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ➕ Add Scholarship/Event
          </button>
        </div>
        <p style={{ color: "#6b7280" }}>Keep track of important scholarship deadlines and events.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Calendar */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Calendar Header */}
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>{formatDate(currentDate)}</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => navigateMonth(-1)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth(1)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#6b7280",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              padding: "0.5rem",
            }}
          >
            {renderCalendar()}
          </div>
        </div>

        {/* Upcoming Events */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            height: "fit-content",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Upcoming Events</h3>
          </div>
          <div style={{ padding: "1rem" }}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const eventStyle = getEventColor(event.type)
                return (
                  <div
                    key={event.id}
                    style={{
                      padding: "1rem",
                      marginBottom: "1rem",
                      borderRadius: "8px",
                      backgroundColor: eventStyle.bg,
                      border: `1px solid ${eventStyle.border}`,
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1rem" }}>{getEventIcon(event.type)}</span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: eventStyle.text,
                          flex: 1,
                        }}
                      >
                        {event.title}
                      </span>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: getPriorityColor(event.priority),
                        }}
                      ></div>
                      {event.isCustom && (
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            onClick={() => handleEditEvent(event)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              padding: "0.25rem",
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              padding: "0.25rem",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    {event.amount && (
                      <div
                        style={{ fontSize: "0.75rem", color: "#059669", fontWeight: "600", marginBottom: "0.25rem" }}
                      >
                        {event.amount}
                      </div>
                    )}
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{event.description}</div>
                  </div>
                )
              })
            ) : (
              <div style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No upcoming events</div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && getEventsForDate(selectedDate).length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>
              Events on {currentDate.toLocaleDateString("en-US", { month: "long" })} {selectedDate}
            </h3>
          </div>
          <div style={{ padding: "1rem" }}>
            {getEventsForDate(selectedDate).map((event) => {
              const eventStyle = getEventColor(event.type)
              return (
                <div
                  key={event.id}
                  style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    backgroundColor: eventStyle.bg,
                    border: `1px solid ${eventStyle.border}`,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{getEventIcon(event.type)}</span>
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: eventStyle.text,
                        flex: 1,
                      }}
                    >
                      {event.title}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>at {event.time}</span>
                    {event.isCustom && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEditEvent(event)}
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {event.amount && (
                    <div style={{ fontSize: "0.875rem", color: "#059669", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Amount: {event.amount}
                    </div>
                  )}
                  {event.requirements && (
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                      Requirements: {event.requirements}
                    </div>
                  )}
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{event.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {showAddEventModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddEventModal(false)
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>
                {editingEvent ? "Edit Event" : "Add New Scholarship/Event"}
              </h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "grid", gap: "1rem" }}>
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
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="e.g., Merit Scholarship Application"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleFormChange("date", e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                      }}
                    />
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
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleFormChange("time", e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleFormChange("type", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="deadline">Scholarship Deadline</option>
                      <option value="interview">Interview</option>
                      <option value="task">Task/Document</option>
                      <option value="meeting">Meeting</option>
                      <option value="scholarship">Scholarship Event</option>
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
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleFormChange("priority", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
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
                    Scholarship Amount (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => handleFormChange("amount", e.target.value)}
                    placeholder="e.g., $5,000"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    }}
                  />
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
                    Requirements (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.requirements}
                    onChange={(e) => handleFormChange("requirements", e.target.value)}
                    placeholder="e.g., GPA 3.5+, Essay, Transcripts"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    }}
                  />
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
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFormChange("description", e.target.value)}
                    placeholder="Add any additional details about this scholarship or event..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
                >
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarPage
