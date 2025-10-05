"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./adminStyles/adminDashboard.css"

const ApplicantDetail = () => {
  const { jobId, userId } = useParams()
  const navigate = useNavigate()
  const [applicant, setApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [expandedDoc, setExpandedDoc] = useState(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch applicant details when component mounts
  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("adminToken")
        
        if (!token) {
          throw new Error("No authentication token found. Please log in again.")
        }

        const response = await fetch(`http://localhost:5000/api/admin/${jobId}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch applicant details")
        }

        setApplicant(result.user)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching applicant details:", err)
        setError(err.message || "An error occurred while fetching applicant details")
        setLoading(false)
      }
    }

    fetchApplicantDetails()
  }, [jobId, userId])

  const handleBackToApplicants = () => {
    navigate(`/admin/job/${jobId}/applicants`)
  }

  const handleBackToJobs = () => {
    navigate("/adminDashboard")
  }

  const handleEditProfile = () => {
    console.log("Edit Profile clicked")
    setIsProfileDropdownOpen(false)
  }

  const handleLogout = () => {
    console.log("Logout clicked")
    setIsProfileDropdownOpen(false)
    // Remove token from localStorage
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminId")
    // Navigate to login page
    navigate("/adminLoginForm")
  }

  const toggleDocument = (docName) => {
    setExpandedDoc(expandedDoc === docName ? null : docName)
  }

  const handleQuickAction = (action) => {
    console.log(`[v0] ${action} action for applicant ${applicant._id}`)
    // Add your action logic here
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Interview Scheduled":
        return "status-scheduled"
      case "Under Review":
        return "status-review"
      case "Offer Extended":
        return "status-offer"
      case "Rejected":
        return "status-rejected"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-content-wrapper-full">
          <div className="loading-state">
            <p>Loading applicant details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-content-wrapper-full">
          <div className="error-state">
            <p>Error: {error}</p>
            <button onClick={handleBackToApplicants} className="back-button">
              ← Back to Applicants
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!applicant) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-content-wrapper-full">
          <div className="empty-state">
            <h3>Applicant not found</h3>
            <p>The applicant you're looking for doesn't exist.</p>
            <button onClick={handleBackToApplicants} className="back-button">
              ← Back to Applicants
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Find the specific applied job for this applicant
  const appliedJob = applicant.appliedJobs.find(job => 
    job.jobId.toString() === jobId
  ) || {};

  const isInterviewCompleted = applicant.interviewRounds && 
    applicant.interviewRounds.some(
      (round) => round.status === "Completed" && round.round.toLowerCase().includes("final")
    );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-content-wrapper-full">
        <header className="admin-header-transparent">
          <div className="header-logo">
            <div className="logo-icon">TC</div>
            <span className="logo-text">TechCorp Admin</span>
          </div>
          <div className="header-profile" ref={dropdownRef}>
            <button className="profile-button" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
              <div className="profile-avatar-small">JA</div>
              <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={handleEditProfile}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="admin-main">
          <div className="dashboard-layout">
            {/* Left sidebar with stats */}
            <aside className="stats-sidebar">
              <div className="stat-card completed">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
                <div className="stat-number">6</div>
                <div className="stat-label">Completed Interviews</div>
                <div className="stat-progress completed-progress"></div>
              </div>

              <div className="stat-card pending">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                </div>
                <div className="stat-number">2</div>
                <div className="stat-label">Pending Interviews</div>
                <div className="stat-progress pending-progress"></div>
              </div>

              <div className="stat-card quick-stats">
                <div className="stat-label-header">Quick Stats</div>
                <div className="quick-stat-row">
                  <span className="quick-stat-label">Total Candidates</span>
                  <span className="quick-stat-value">8</span>
                </div>
                <div className="quick-stat-row">
                  <span className="quick-stat-label">Avg Fit Score</span>
                  <span className="quick-stat-value">84%</span>
                </div>
              </div>

              <div className="stat-card list-job" onClick={handleBackToJobs}>
                <div className="list-job-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <div className="list-job-label">Back to Dashboard</div>
              </div>
            </aside>

            {/* Main content area */}
            <div className="main-content-area">
              <button className="back-button" onClick={handleBackToApplicants}>
                ← Back to Applicants
              </button>

              {/* Header Card */}
              <div className="detail-header-card">
                <div className="detail-header-content">
                  <div className="detail-avatar">
                    {applicant.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="detail-info">
                    <h1>{applicant.fullName}</h1>
                    <h2>{appliedJob.role || "Position Not Specified"}</h2>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
                      {appliedJob.status && (
                        <span className={`status-badge ${getStatusClass(appliedJob.status)}`}>
                          {appliedJob.status}
                        </span>
                      )}
                    </div>
                    <div className="detail-meta">
                      <div className="meta-item">
                        <span className="detail-icon">📧</span>
                        <span>{applicant.email}</span>
                      </div>
                      <div className="meta-item">
                        <span className="detail-icon">📞</span>
                        <span>{applicant.mobile}</span>
                      </div>
                      <div className="meta-item">
                        <span className="detail-icon">📍</span>
                        <span>{applicant.location || "Location Not Specified"}</span>
                      </div>
                      <div className="meta-item">
                        <span className="detail-icon">💼</span>
                        <span>{applicant.experience} experience</span>
                      </div>
                      <div className="meta-item">
                        <span className="detail-icon">🎓</span>
                        <span>{applicant.education || applicant.qualification || "Education Not Specified"}</span>
                      </div>
                      <div className="meta-item">
                        <span className="detail-icon">📅</span>
                        <span>
                          Applied: {appliedJob.appliedAt ? new Date(appliedJob.appliedAt).toLocaleDateString() : "Date Not Available"}
                        </span>
                      </div>
                      {appliedJob.interviewDate && (
                        <div className="meta-item">
                          <span className="detail-icon">📅</span>
                          <span>
                            Interview: {new Date(appliedJob.interviewDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {appliedJob.fitScore && (
                    <div style={{ marginTop: "15px" }}>
                      <div style={{ 
                        backgroundColor: "#4CAF50", 
                        color: "white", 
                        padding: "12px 20px", 
                        borderRadius: "8px", 
                        fontSize: "1.2rem", 
                        fontWeight: "bold",
                        display: "inline-block"
                      }}>
                        Fit Score: {appliedJob.fitScore}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="detail-content-grid">
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Skills Section */}
                  <div className="detail-section">
                    <h3 className="section-title">
                      <span className="section-icon">🛠️</span>
                      Skills & Expertise
                    </h3>
                    <div className="skills-container">
                      {applicant.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interview Summary Section */}
                  <div className="detail-section">
                    <h3 className="section-title">
                      <span className="section-icon">📋</span>
                      Interview Summary
                    </h3>
                    <div className="notes-content">
                      {applicant.interviewTranscript ? (
                        <p>{applicant.interviewTranscript}</p>
                      ) : (
                        <p>No interview summary available yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Interview Rounds */}
                  {applicant.interviewRounds && applicant.interviewRounds.length > 0 && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <span className="section-icon">📊</span>
                        Interview Progress
                      </h3>
                      <div className="interview-rounds">
                        {applicant.interviewRounds.map((round, index) => (
                          <div key={index} className="round-item">
                            <div className="round-info">
                              <h4>{round.round}</h4>
                              <p className="round-date">
                                {round.date ? new Date(round.date).toLocaleDateString() : "Date Not Set"}
                              </p>
                              <span
                                className={`status-badge ${
                                  round.status === "Completed" ? "status-offer" : "status-scheduled"
                                }`}
                              >
                                {round.status}
                              </span>
                            </div>
                            {round.score && <div className="round-score">{round.score}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="detail-section">
                    <h3 className="section-title">
                      <span className="section-icon">📄</span>
                      Documents
                    </h3>
                    <div className="documents-list">
                      <div className="document-item">
                        <div className="document-header" onClick={() => toggleDocument("resume")}>
                          <div className="document-title">
                            <span>📄</span>
                            <span>Resume</span>
                          </div>
                          <span>{expandedDoc === "resume" ? "▲" : "▼"}</span>
                        </div>
                        <div className={`document-content ${expandedDoc !== "resume" ? "collapsed" : ""}`}>
                          <p>
                            {applicant.resumeText ? (
                              applicant.resumeText
                            ) : (
                              "No resume text available. In a real application, this would display the actual resume content."
                            )}
                          </p>
                        </div>
                      </div>

                      {applicant.coverLetter && (
                        <div className="document-item">
                          <div className="document-header" onClick={() => toggleDocument("cover")}>
                            <div className="document-title">
                              <span>📝</span>
                              <span>Cover Letter</span>
                            </div>
                            <span>{expandedDoc === "cover" ? "▲" : "▼"}</span>
                          </div>
                          <div className={`document-content ${expandedDoc !== "cover" ? "collapsed" : ""}`}>
                            <p>
                              {applicant.coverLetter.substring(0, 500) + (applicant.coverLetter.length > 500 ? "..." : "")}
                            </p>
                          </div>
                        </div>
                      )}

                      <div
                        className="document-header"
                        onClick={() => applicant.interviewTranscript && toggleDocument("transcript")}
                        style={{ 
                          cursor: applicant.interviewTranscript ? "pointer" : "default",
                          padding: "12px 16px",
                          backgroundColor: "#2D3748",
                          borderRadius: "8px",
                          marginBottom: "8px"
                        }}
                      >
                        <div className="document-title">
                          <span>🎙️</span>
                          <span>Interview Transcript</span>
                        </div>
                        {applicant.interviewTranscript ? (
                          <span>{expandedDoc === "transcript" ? "▲" : "▼"}</span>
                        ) : (
                          <span className="pending-badge">Not Available</span>
                        )}
                      </div>
                      {applicant.interviewTranscript && (
                        <div className={`document-content ${expandedDoc !== "transcript" ? "collapsed" : ""}`}>
                          <p>{applicant.interviewTranscript}</p>
                        </div>
                      )}

                      {applicant.portfolio && (
                        <div className="document-item">
                          <div 
                            className="document-header" 
                            onClick={() => window.open(applicant.portfolio, "_blank")}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="document-title">
                              <span>🔗</span>
                              <span>Portfolio</span>
                            </div>
                            <span>↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Interview Notes */}
                  {applicant.notes && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <span className="section-icon">📝</span>
                        Interview Notes
                      </h3>
                      <div className="notes-content notes-preview">
                        <p>{applicant.notes?.substring(0, 150)}...</p>
                        <button className="expand-notes-btn" onClick={() => setShowNotesModal(true)}>
                          Read Full Notes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="detail-section">
                    <h3 className="section-title">
                      <span className="section-icon">⚡</span>
                      Quick Actions
                    </h3>
                    <div className="quick-actions-grid">
                      <button className="action-btn accept" onClick={() => handleQuickAction("Accept")}>
                        ✓ Accept
                      </button>
                      <button className="action-btn reject" onClick={() => handleQuickAction("Reject")}>
                        ✗ Reject
                      </button>
                      <button className="action-btn mail" onClick={() => handleQuickAction("Send Mail")}>
                        ✉ Send Mail
                      </button>
                      <button className="action-btn notes" onClick={() => handleQuickAction("Add Notes")}>
                        📝 Add Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showNotesModal && applicant.notes && (
        <div className="notes-modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h3>Interview Notes</h3>
              <button className="close-modal-btn" onClick={() => setShowNotesModal(false)}>
                ✕
              </button>
            </div>
            <div className="notes-modal-content">
              <p>{applicant.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantDetail