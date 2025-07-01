import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css'; // Assuming you have a HomePage component for the hero section
import { useNavigate, Link } from 'react-router-dom';


const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/scholarships/')
      .then((res) => {
        setScholarships(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading scholarships:', err);
        setError('Failed to load scholarships');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { icon: '🎓', label: 'Active Scholarships', value: '2,500+' },
    { icon: '💰', label: 'Total Funding', value: '$50M+' },
    { icon: '👥', label: 'Students Helped', value: '15,000+' },
    { icon: '🏆', label: 'Success Rate', value: '78%' },
  ];

  // Since you don't have an "is_featured" flag, just pick first 3 scholarships for "Featured"
  const featuredScholarships = scholarships.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
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
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Perfect Scholarship</h1>
            <p className="hero-subtitle">
              Discover thousands of scholarships tailored to your profile and goals
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search scholarships by keyword, field, or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  🔍
                </button>
              </div>
            </form>

            <div className="quick-filters">
              <button className="filter-button" onClick={() => navigate('/scholarships?category=STEM')}>
                STEM Scholarships
              </button>
              <button className="filter-button" onClick={() => navigate('/scholarships?category=Merit-Based')}>
                Merit-Based
              </button>
              <button className="filter-button" onClick={() => navigate('/scholarships?category=Need-Based')}>
                Need-Based
              </button>
              <button className="filter-button" onClick={() => navigate('/scholarships?category=International')}>
                International Students
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Scholarships</h2>
            <p className="section-subtitle">Don't miss these popular opportunities</p>
          </div>

          {loading ? (
            <p>Loading featured scholarships...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : featuredScholarships.length === 0 ? (
            <p>No scholarships found.</p>
          ) : (
            <div className="scholarships-grid">
              {featuredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="scholarship-card">
                  <div className="card-header">
                    <h3 className="card-title">{scholarship.title}</h3>
                    <span className="card-category">{scholarship.level || 'Category'}</span>
                  </div>
                  <div className="card-content">
                    <div className="card-details">
                      <span className="card-amount">{scholarship.amount}</span>
                      <span className="card-deadline">Due: {scholarship.deadline}</span>
                    </div>
                    <button
                      className="card-button"
                      onClick={() => navigate(`/scholarships/${scholarship.id}`)}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-footer">
            <button className="view-all-button" onClick={() => navigate('/scholarships')}>
              View All Scholarships
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Your Account</h3>
              <p className="step-description">
                Tell us about your academic background, interests, and goals
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Start using your account</h3>
              <p className="step-description">
                Our algorithm finds scholarships that match your profile
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Apply</h3>
              <p className="step-description">
                Apply through our platform or visit the main scholarship website for details
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Scholarship?</h2>
            <p className="cta-subtitle">
              Join thousands of students who have found funding for their education
            </p>
            <button className="cta-button" onClick={() => navigate('/register')}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">🎓</span>
                ScholarshipFinder
              </div>
              <p className="footer-description">
                Helping students find and secure educational funding opportunities.
              </p>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="/scholarships">Browse Scholarships</a>
                </li>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Categories</h3>
              <ul className="footer-links">
                <li>
                  <a href="/scholarships?category=STEM">STEM</a>
                </li>
                <li>
                  <a href="/scholarships?category=Arts & Humanities">Arts & Humanities</a>
                </li>
                <li>
                  <a href="/scholarships?category=Business">Business</a>
                </li>
                <li>
                  <a href="/scholarships?category=Sports">Sports</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3 className="footer-title">Support</h3>
              <ul className="footer-links">
                <li>
                  <a href="/help">Help Center</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ScholarshipFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
