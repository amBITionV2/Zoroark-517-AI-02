"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./adminStyles/adminDashboard.css"

const JobApplicants = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
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

  // Fetch applicants when component mounts
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("adminToken")
        
        if (!token) {
          throw new Error("No authentication token found. Please log in again.")
        }

        const response = await fetch(`http://localhost:5000/api/admin/${jobId}/applicants`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch applicants")
        }

        setApplicants(result.applicants)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching applicants:", err)
        setError(err.message || "An error occurred while fetching applicants")
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [jobId])

  const handleApplicantClick = (applicantId) => {
    // Navigate to applicant details page
    navigate(`/admin/applicant/${jobId}/${applicantId}`)
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
              <button className="back-to-jobs-btn" onClick={handleBackToJobs}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
                Back to Job Posts
              </button>

              <div className="content-header">
                <h2>Job Applicants</h2>
                <p className="content-subtitle">List of candidates who applied for this position</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <p>Loading applicants...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>Error: {error}</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="empty-state">
                  <h3>No applicants found</h3>
                  <p>No candidates have applied for this position yet.</p>
                </div>
              ) : (
                <div className="applicants-table">
                  <div className="table-header">
                    <div className="table-cell">Candidate</div>
                    <div className="table-cell">Email</div>
                    <div className="table-cell">Mobile</div>
                    <div className="table-cell">Experience</div>
                    <div className="table-cell">Status</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  {applicants.map((applicant) => {
                    // Find the specific applied job for this applicant
                    const appliedJob = applicant.appliedJobs.find(job => 
                      job.jobId.toString() === jobId
                    ) || {};
                    
                    return (
                      <div key={applicant._id} className="table-row">
                        <div className="table-cell candidate-cell">
                          <div className="candidate-avatar-small">
                            {applicant.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="candidate-name-email">
                            <div className="candidate-name">{applicant.fullName}</div>
                          </div>
                        </div>
                        <div className="table-cell">{applicant.email}</div>
                        <div className="table-cell">{applicant.mobile}</div>
                        <div className="table-cell">{applicant.experience}</div>
                        <div className="table-cell">
                          <span className={`status-badge ${
                            appliedJob.status === "Completed" ? "status-offer" :
                            appliedJob.status === "Interview Scheduled" ? "status-scheduled" :
                            appliedJob.status === "Under Review" ? "status-review" :
                            appliedJob.status === "Rejected" ? "status-rejected" :
                            "status-review"
                          }`}>
                            {appliedJob.status || "Under Review"}
                          </span>
                        </div>
                        <div className="table-cell actions-cell">
                          <button 
                            className="action-icon-btn" 
                            onClick={() => handleApplicantClick(applicant._id)}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default JobApplicants