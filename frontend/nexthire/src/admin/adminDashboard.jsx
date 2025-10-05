"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { mockJobPosts, mockCandidates } from "./mockData"
import "./adminStyles/adminDashboard.css"

const Dashboard = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("date")
  const [selectedJobPost, setSelectedJobPost] = useState(null)
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

  const stats = useMemo(() => {
    const completedInterviews = mockCandidates.filter((c) => c.status === "Completed").length
    const pendingInterviews = mockCandidates.filter((c) => c.status === "Pending").length
    const totalCandidates = mockCandidates.length
    const avgFitScore = Math.round(
      mockCandidates.filter((c) => c.score > 0).reduce((sum, c) => sum + c.score, 0) /
        mockCandidates.filter((c) => c.score > 0).length,
    )

    return {
      completedInterviews,
      pendingInterviews,
      totalCandidates,
      avgFitScore,
    }
  }, [])

  const filteredCandidates = useMemo(() => {
    if (!selectedJobPost) return []

    let filtered = mockCandidates.filter((c) => c.jobPostId === selectedJobPost.id)

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((candidate) => candidate.status === statusFilter)
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.appliedDate) - new Date(a.appliedDate)
        case "name":
          return a.name.localeCompare(b.name)
        case "score":
          return b.score - a.score
        default:
          return 0
      }
    })

    return filtered
  }, [selectedJobPost, searchTerm, statusFilter, sortBy])

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Completed":
        return "status-completed"
      default:
        return ""
    }
  }

  const handleCardClick = (id) => {
    navigate(`/adminCandidate/${id}`)
  }

  const handleJobPostClick = (jobPost) => {
    setSelectedJobPost(jobPost)
  }

  const handleBackToJobPosts = () => {
    setSelectedJobPost(null)
    setSearchTerm("")
    setStatusFilter("All")
    setSortBy("date")
  }

  const handleEditProfile = () => {
    navigate("/profileSettings")
  }

  const handleLogout = () => {
    navigate("/")
    // Add logout logic here
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
                <div className="stat-number">{stats.completedInterviews}</div>
                <div className="stat-label">Completed Interviews</div>
                <div className="stat-progress completed-progress"></div>
              </div>

              <div className="stat-card pending">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                </div>
                <div className="stat-number">{stats.pendingInterviews}</div>
                <div className="stat-label">Pending Interviews</div>
                <div className="stat-progress pending-progress"></div>
              </div>

              <div className="stat-card quick-stats">
                <div className="stat-label-header">Quick Stats</div>
                <div className="quick-stat-row">
                  <span className="quick-stat-label">Total Candidates</span>
                  <span className="quick-stat-value">{stats.totalCandidates}</span>
                </div>
                <div className="quick-stat-row">
                  <span className="quick-stat-label">Avg Fit Score</span>
                  <span className="quick-stat-value">{stats.avgFitScore}%</span>
                </div>
              </div>

              <div className="stat-card list-job" onClick={() => navigate("/createJob")}>
                <div className="list-job-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <div className="list-job-label">List Job</div>
              </div>
            </aside>

            {/* Main content area */}
            <div className="main-content-area">
              {!selectedJobPost ? (
                <>
                  <div className="content-header">
                    <h2>Job Posts</h2>
                    <p className="content-subtitle">Click on a job post to view candidates</p>
                  </div>

                  <div className="job-posts-grid">
                    {mockJobPosts.map((job) => (
                      <div key={job.id} className="job-post-card" onClick={() => handleJobPostClick(job)}>
                        <div className="job-post-header">
                          <div className="job-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.1 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm-6 0h-4V4h4v2z" />
                            </svg>
                          </div>
                          <h3>{job.title}</h3>
                          <svg className="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                          </svg>
                        </div>

                        <p className="job-description">{job.description}</p>

                        <div className="job-details-grid">
                          <div className="job-detail">
                            <svg className="detail-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span>{job.location}</span>
                          </div>
                          <div className="job-detail">
                            <svg className="detail-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                            </svg>
                            <span>{job.salaryRange}</span>
                          </div>
                          <div className="job-detail">
                            <svg className="detail-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            <span>{job.experience}</span>
                          </div>
                          <div className="job-detail">
                            <svg className="detail-icon" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.1 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm-6 0h-4V4h4v2z" />
                            </svg>
                            <span>{job.employmentType}</span>
                          </div>
                        </div>

                        <div className="job-skills">
                          {job.skills.map((skill, index) => (
                            <span key={index} className="skill-badge">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="job-footer">
                          <div className="candidate-count">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                            </svg>
                            <span>{job.candidateCount} candidates</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button className="back-to-jobs-btn" onClick={handleBackToJobPosts}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                    Back to Job Posts
                  </button>

                  <div className="job-detail-header">
                    <div className="job-icon-large">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.1 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm-6 0h-4V4h4v2z" />
                      </svg>
                    </div>
                    <div className="job-detail-info">
                      <h2>{selectedJobPost.title}</h2>
                      <p>{selectedJobPost.description}</p>
                      <div className="candidate-count-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                        <span>{selectedJobPost.candidateCount} candidates</span>
                      </div>
                    </div>
                  </div>

                  <div className="candidates-controls">
                    <div className="search-box-candidates">
                      <svg className="search-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5S13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="filter-select-candidates"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <select
                      className="sort-select-candidates"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Sort by Date</option>
                      <option value="name">Sort by Name</option>
                      <option value="score">Sort by Score</option>
                    </select>
                  </div>

                  {filteredCandidates.length === 0 ? (
                    <div className="empty-state">
                      <h3>No candidates found</h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div className="candidates-table">
                      <div className="table-header">
                        <div className="table-cell">Candidate</div>
                        <div className="table-cell">Position</div>
                        <div className="table-cell">Status</div>
                        <div className="table-cell">Fit Score</div>
                        <div className="table-cell">Date</div>
                        <div className="table-cell">Actions</div>
                      </div>
                      {filteredCandidates.map((candidate) => (
                        <div key={candidate.id} className="table-row">
                          <div className="table-cell candidate-cell">
                            <div className="candidate-avatar-small">
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="candidate-name-email">
                              <div className="candidate-name">{candidate.name}</div>
                              <div className="candidate-email">{candidate.email}</div>
                            </div>
                          </div>
                          <div className="table-cell">{candidate.position}</div>
                          <div className="table-cell">
                            <span className={`status-badge-table ${getStatusClass(candidate.status)}`}>
                              {candidate.status === "Completed" && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                              {candidate.status === "Pending" && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                              )}
                              {candidate.status}
                            </span>
                          </div>
                          <div className="table-cell">
                            {candidate.fitScore !== "---" && (
                              <div className="fit-score-indicator">
                                <div className="fit-score-dot"></div>
                                <span>{candidate.fitScore}</span>
                              </div>
                            )}
                            {candidate.fitScore === "---" && <span className="fit-score-pending">---</span>}
                          </div>
                          <div className="table-cell">{new Date(candidate.appliedDate).toLocaleDateString()}</div>
                          <div className="table-cell actions-cell">
                            <button className="action-icon-btn" onClick={() => handleCardClick(candidate.id)}>
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                              </svg>
                            </button>
                            <button className="action-icon-btn">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
