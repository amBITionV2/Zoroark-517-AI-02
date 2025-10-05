import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./adminStyles/createJobs.css"

const CreateJob = () => {
  const navigate = useNavigate()
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

  const [formData, setFormData] = useState({
    role: "",
    jobDescription: "",
    salary: "",
    location: "",
    experienceRequired: "",
    skillsRequired: [],
    jobType: "Full-time",
    applicationDeadline: "",
    hackerRankLink: "",
    mcqDifficulty: "Medium",
    mcqQuestions: "",
  })

  const [currentSkill, setCurrentSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skillsRequired.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Job Posted:", formData)
    setIsSubmitting(false)

    // Reset form
    setFormData({
      role: "",
      jobDescription: "",
      salary: "",
      location: "",
      experienceRequired: "",
      skillsRequired: [],
      jobType: "Full-time",
      applicationDeadline: "",
      hackerRankLink: "",
      mcqDifficulty: "Medium",
      mcqQuestions: "",
    })

    // Navigate back to dashboard
    navigate("/adminDashboard")
  }

  const handleEditProfile = () => {
    navigate("/profileSettings")
  }

  const handleLogout = () => {
    console.log("Logout clicked")
    setIsProfileDropdownOpen(false)
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

              <div className="stat-card list-job" onClick={() => navigate("/adminDashboard")}>
                <div className="list-job-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <div className="list-job-label">Back to Dashboard</div>
              </div>
            </aside>

            {/* Main content area - Job Creation Form */}
            <div className="main-content-area">
              <div className="content-header">
                <h2>Create New Job Post</h2>
                <p className="content-subtitle">Fill in the details to post a new job opening</p>
              </div>

              <form onSubmit={handleSubmit} className="job-form">
                <div className="form-section">
                  <h3 className="form-section-title">Job Information</h3>

                  <div className="form-group">
                    <label htmlFor="role" className="form-label">
                      Job Role <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. Frontend Developer"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="jobDescription" className="form-label">
                      Job Description <span className="required">*</span>
                    </label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Looking for React developer with 2+ years experience..."
                      rows="5"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="salary" className="form-label">
                        Salary Range <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="50000-70000"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        Location <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Bangalore"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="experienceRequired" className="form-label">
                        Experience Required <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="experienceRequired"
                        name="experienceRequired"
                        value={formData.experienceRequired}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="2-4 years"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="jobType" className="form-label">
                        Job Type <span className="required">*</span>
                      </label>
                      <select
                        id="jobType"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicationDeadline" className="form-label">
                      Application Deadline <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="applicationDeadline"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hackerRankLink" className="form-label">
                      HackerRank Link
                    </label>
                    <input
                      type="url"
                      id="hackerRankLink"
                      name="hackerRankLink"
                      value={formData.hackerRankLink}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://hackerrank.com/test/..."
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Required Skills</h3>

                  <div className="form-group">
                    <label htmlFor="skills" className="form-label">
                      Skills <span className="required">*</span>
                    </label>
                    <div className="skills-input-wrapper">
                      <input
                        type="text"
                        id="skills"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddSkill()
                          }
                        }}
                        className="form-input"
                        placeholder="e.g. React, JavaScript"
                      />
                      <button type="button" onClick={handleAddSkill} className="add-skill-btn">
                        Add
                      </button>
                    </div>
                  </div>

                  {formData.skillsRequired.length > 0 && (
                    <div className="skills-list">
                      {formData.skillsRequired.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="remove-skill-btn">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-section mcq-section">
                  <h3 className="form-section-title">MCQ Assessment</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="mcqDifficulty" className="form-label">
                        Difficulty Level <span className="required">*</span>
                      </label>
                      <select
                        id="mcqDifficulty"
                        name="mcqDifficulty"
                        value={formData.mcqDifficulty}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="mcqQuestions" className="form-label">
                        Number of Questions <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        id="mcqQuestions"
                        name="mcqQuestions"
                        value={formData.mcqQuestions}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="10"
                        min="1"
                        max="50"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => navigate("/adminDashboard")} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="submit-btn">
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Posting...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Post Job
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CreateJob