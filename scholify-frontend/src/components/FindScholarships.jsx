"use client"

import { useState, useEffect } from "react"

const FindScholarships = () => {
  const [scholarships, setScholarships] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAmount, setSelectedAmount] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholarships = async () => {
      const userData = JSON.parse(localStorage.getItem("user"))
      if (!userData || !userData.token) {
        return
      }

      try {
        const response = await fetch("http://localhost:8000/api/scholarships/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${userData.token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch scholarships")

        const data = await response.json()
        setScholarships(data)
      } catch (error) {
        console.error("Error fetching scholarships:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScholarships()
  }, [])

  const categories = ["all", "Academic", "STEM", "Community", "Need-based", "Arts", "Sports"]
  const amounts = ["all", "$1,000-$2,500", "$2,500-$5,000", "$5,000+"]

  const filterByAmount = (amountStr, amount) => {
    const num = parseFloat(amount.replace(/[$,]/g, ""))
    if (amountStr === "$1,000-$2,500") return num >= 1000 && num <= 2500
    if (amountStr === "$2,500-$5,000") return num > 2500 && num <= 5000
    if (amountStr === "$5,000+") return num > 5000
    return true
  }

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scholarship.category === selectedCategory
    const matchesAmount = selectedAmount === "all" || filterByAmount(selectedAmount, scholarship.amount)
    return matchesSearch && matchesCategory && matchesAmount
  })

  if (loading) {
    return <p>Loading scholarships...</p>
  }

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
          Find Scholarships 🔍
        </h2>
        <p style={{ color: "#6b7280" }}>Discover scholarships that match your profile and interests.</p>
      </div>

      {/* Filters */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
              Search Scholarships
            </label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.875rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.875rem", backgroundColor: "white" }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
              Amount Range
            </label>
            <select
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.875rem", backgroundColor: "white" }}
            >
              {amounts.map((amount) => (
                <option key={amount} value={amount}>
                  {amount === "all" ? "All Amounts" : amount}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          Found {filteredScholarships.length} scholarships matching your criteria
        </p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {filteredScholarships.map((scholarship) => (
          <div key={scholarship.id} style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{scholarship.title}</h3>
                  <span style={{ backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "500" }}>
                    {scholarship.match || "N/A"}% match
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#059669" }}>{scholarship.amount}</span>
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                  <span style={{ backgroundColor: "#f3f4f6", color: "#374151", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem" }}>
                    {scholarship.category}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ color: "#6b7280", marginBottom: "1rem", lineHeight: "1.5" }}>{scholarship.description}</p>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Requirements:
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(scholarship.requirements || []).map((req, index) => (
                  <span key={index} style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem" }}>
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={{ backgroundColor: "#2563eb", color: "white", padding: "0.75rem 1.5rem", border: "none", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer" }}>
                Apply Now
              </button>
              <button style={{ backgroundColor: "transparent", color: "#6b7280", padding: "0.75rem 1.5rem", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer" }}>
                Save for Later
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FindScholarships
