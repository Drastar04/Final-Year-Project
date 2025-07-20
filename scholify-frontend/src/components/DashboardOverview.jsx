import React from 'react'

// src/components/DashboardOverview.jsx
const DashboardOverview = ({ bookmarkedScholarships, recommendations }) => {
  return (
    <div>
      <h3>Bookmarked Scholarships</h3>
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

      <h3>Recommended Scholarships</h3>
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
    </div>
  );
};

export default DashboardOverview;
