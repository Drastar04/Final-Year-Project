import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ScholarshipsPage.css';


const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Fetch scholarships from the API

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/scholarships/')
      .then(res => {
        setScholarships(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load scholarships.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-center">Loading scholarships...</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

  return (
  <div className="container">
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎓</span>
          ScholarshipFinder
        </Link>
        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/scholarships" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Browse Scholarships
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
          <Link to="/register" className="nav-button" onClick={() => setIsMenuOpen(false)}>
            Sign Up
          </Link>
        </div>

        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
    <h1 className="title">Available Scholarships</h1>

    {loading && <p className="loading">Loading scholarships...</p>}
    {error && <p className="error">{error}</p>}
    {!loading && !error && scholarships.length === 0 && (
      <p className="no-data">No scholarships found.</p>
    )}

    <div className="grid">
        {/* {scholarships.slice(0, 3).map((scholarship) => ( */}
      {scholarships.map((scholarship) => (
        <div key={scholarship.id} className="card">
          <h2 className="cardTitle">{scholarship.title}</h2>
          <p className="cardProvider"><strong>Provider:</strong> {scholarship.provider}</p>
          <p className="cardText"><strong>Amount:</strong> {scholarship.amount}</p>
          <p className="cardText"><strong>Deadline:</strong> {scholarship.deadline}</p>
          <Link to={`/scholarships/${scholarship.id}`} className="viewDetailsBtn">
            View Details →
          </Link>
        </div>
      ))}
    </div>
  </div>
);
};

export default ScholarshipsPage;
