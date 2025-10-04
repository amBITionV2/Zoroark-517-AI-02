import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaChevronDown,
  FaUser,
  FaBriefcase,
  FaClipboardList,
  FaSignOutAlt,
  FaLink,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaLightbulb,
  FaCalendar,
} from "react-icons/fa";
import "./styles/UserPage.css";

const UserPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="user-loading-container">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mx-auto mb-4 user-loading-spinner"></div>
          <p className="text-xl user-loading-text">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page-container">
      {/* Header */}
      <header className="user-header">
        <div className="user-header-content">
          {/* Left: Welcome Message */}
          <div className="user-welcome-section">
            <p className="user-welcome-label">Welcome back,</p>
            <p className="user-welcome-name">{user.fullName}</p>
          </div>

          {/* Center: Logo */}
          <h1 className="user-logo">NextHire</h1>

          {/* Right: Profile Icon */}
          <div className="user-profile-wrapper">
            <button
              className={`user-profile-btn ${openProfile ? 'active' : ''}`}
              onClick={() => setOpenProfile(!openProfile)}
            >
              <FaUserCircle size={40} className="user-profile-icon" />
              <FaChevronDown className={`user-profile-chevron ${openProfile ? 'open' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {openProfile && (
              <div className="user-profile-dropdown">
                <div className="user-profile-header">
                  <h2 className="user-profile-title">Your Profile</h2>
                  <button
                    onClick={() => setOpenProfile(false)}
                    className="user-profile-close"
                  >
                    ✕
                  </button>
                </div>

                <div className="user-profile-info">
                  <p className="user-profile-info-item">
                    <FaUser className="user-profile-info-icon" />
                    <strong className="user-profile-info-label">Name:</strong> {user.fullName}
                  </p>
                  <p className="user-profile-info-item">
                    <FaEnvelope className="user-profile-info-icon" />
                    <strong className="user-profile-info-label">Email:</strong> {user.email}
                  </p>
                  <p className="user-profile-info-item">
                    <FaPhone className="user-profile-info-icon" />
                    <strong className="user-profile-info-label">Mobile:</strong> {user.mobile}
                  </p>
                  <p className="user-profile-info-item">
                    <FaBriefcase className="user-profile-info-icon" />
                    <strong className="user-profile-info-label">Experience:</strong> {user.experience}
                  </p>
                  <p className="user-profile-info-item">
                    <FaLink className="user-profile-info-icon" />
                    <strong className="user-profile-info-label">Portfolio:</strong>{" "}
                    <a 
                      href={user.portfolio} 
                      target="_blank"
                      rel="noreferrer"
                      className="user-profile-link"
                    >
                      View Portfolio
                    </a>
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="user-logout-btn"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="user-main-content">
        {/* Info Section */}
        <section className="user-info-section">
          <p className="user-info-text">
            Manage your profile, explore exciting job opportunities, and track your application journey.
          </p>
        </section>

        {/* 3 Main Options */}
        <section className="user-dashboard-grid">
          {/* Manage Profile */}
          <div className="user-dashboard-card" onClick={() => navigate("/profile")}>
            <div className="user-dashboard-icon-wrapper">
              <div className="user-dashboard-icon-bg">
                <FaUser size={32} className="user-dashboard-icon" />
              </div>
            </div>
            <h3 className="user-dashboard-card-title">Manage Profile</h3>
            <p className="user-dashboard-card-text">
              Update your personal information, resume, and portfolio
            </p>
          </div>

          {/* View Jobs */}
          <div className="user-dashboard-card" onClick={() => navigate("/jobs")}>
            <div className="user-dashboard-icon-wrapper">
              <div className="user-dashboard-icon-bg cyan">
                <FaBriefcase size={32} className="user-dashboard-icon" />
              </div>
            </div>
            <h3 className="user-dashboard-card-title">View Jobs</h3>
            <p className="user-dashboard-card-text">
              Browse exciting job opportunities matching your skills
            </p>
          </div>

          {/* Track Applications */}
          <div className="user-dashboard-card" onClick={() => navigate("/applications")}>
            <div className="user-dashboard-icon-wrapper">
              <div className="user-dashboard-icon-bg cyan">
                <FaClipboardList size={32} className="user-dashboard-icon" />
              </div>
            </div>
            <h3 className="user-dashboard-card-title">Track Applications</h3>
            <p className="user-dashboard-card-text">
              Monitor the status of all your job applications
            </p>
          </div>
        </section>

        {/* About You Section */}
        <section className="user-about-section">
          <h3 className="user-about-title">About You</h3>
          <p className="user-about-bio">
            {user.about || "No bio added yet. Share something about yourself!"}
          </p>
          <div className="user-about-grid">
            <div className="user-about-item">
              <FaEnvelope size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Email</p>
                <p className="user-about-value">{user.email}</p>
              </div>
            </div>
            <div className="user-about-item">
              <FaPhone size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Mobile</p>
                <p className="user-about-value">{user.mobile}</p>
              </div>
            </div>
            <div className="user-about-item">
              <FaUser size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Gender</p>
                <p className="user-about-value">{user.gender}</p>
              </div>
            </div>
            <div className="user-about-item">
              <FaCalendar size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Date of Birth</p>
                <p className="user-about-value">{user.dob ? new Date(user.dob).toLocaleDateString() : "Not provided"}</p>
              </div>
            </div>
            <div className="user-about-item">
              <FaGraduationCap size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Qualification</p>
                <p className="user-about-value">{user.qualification}</p>
              </div>
            </div>
            <div className="user-about-item">
              <FaBriefcase size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Experience</p>
                <p className="user-about-value">{user.experience}</p>
              </div>
            </div>
            <div className="user-about-item">
              <FaLink size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Portfolio</p>
                <a 
                  href={user.portfolio} 
                  target="_blank"
                  rel="noreferrer"
                  className="user-profile-link user-about-value"
                >
                  {user.portfolio}
                </a>
              </div>
            </div>
            <div className="user-about-item">
              <FaLightbulb size={20} className="user-about-icon" />
              <div>
                <p className="user-about-label">Skills</p>
                <div className="user-about-skills">
                  {user.skills?.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserPage;