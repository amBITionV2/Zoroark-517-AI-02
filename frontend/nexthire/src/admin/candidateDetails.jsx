"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { mockCandidates } from "./mockData"
import "./adminStyles/adminDashboard.css"

const CandidateDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expandedDoc, setExpandedDoc] = useState(null)
  const [showNotesModal, setShowNotesModal] = useState(false)

  const candidate = mockCandidates.find((c) => c.id === Number.parseInt(id))

  if (!candidate) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <button className="back-button" onClick={() => navigate("/adminDashboard")}>
            ← Back to Dashboard
          </button>
          <div className="empty-state">
            <h3>Candidate not found</h3>
            <p>The candidate you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
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

  const toggleDocument = (docName) => {
    setExpandedDoc(expandedDoc === docName ? null : docName)
  }

  const handleQuickAction = (action) => {
    console.log(`[v0] ${action} action for candidate ${candidate.id}`)
    // Add your action logic here
  }

  const isInterviewCompleted = candidate.interviewRounds.some(
    (round) => round.status === "Completed" && round.round.toLowerCase().includes("final"),
  )

  return (
    <div className="detail-page admin-dashboard-container">
      <div className="detail-container">
        <button className="back-button" onClick={() => navigate("/adminDashboard")}>
          ← Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="detail-header-card">
          <div className="detail-header-content">
            <div className="detail-avatar">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="detail-info">
              <h1>{candidate.name}</h1>
              <h2>{candidate.position}</h2>
              <span className={`status-badge ${getStatusClass(candidate.status)}`}>{candidate.status}</span>
              <div className="detail-meta">
                <div className="meta-item">
                  <span className="detail-icon">📧</span>
                  <span>{candidate.email}</span>
                </div>
                <div className="meta-item">
                  <span className="detail-icon">📞</span>
                  <span>{candidate.phone}</span>
                </div>
                <div className="meta-item">
                  <span className="detail-icon">📍</span>
                  <span>{candidate.location}</span>
                </div>
                <div className="meta-item">
                  <span className="detail-icon">💼</span>
                  <span>{candidate.experience} experience</span>
                </div>
                <div className="meta-item">
                  <span className="detail-icon">🎓</span>
                  <span>{candidate.education}</span>
                </div>
                <div className="meta-item">
                  <span className="detail-icon">📅</span>
                  <span>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="score-circle-container">
              <div className="score-circle" style={{ "--score": candidate.score }}>
                <span className="score-text">{candidate.score}</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Overall Score</span>
            </div>
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
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview Rounds */}
            <div className="detail-section">
              <h3 className="section-title">
                <span className="section-icon">📊</span>
                Interview Progress
              </h3>
              <div className="interview-rounds">
                {candidate.interviewRounds.map((round, index) => (
                  <div key={index} className="round-item">
                    <div className="round-info">
                      <h4>{round.round}</h4>
                      <p className="round-date">{new Date(round.date).toLocaleDateString()}</p>
                      <span
                        className={`status-badge ${round.status === "Completed" ? "status-offer" : "status-scheduled"}`}
                      >
                        {round.status}
                      </span>
                    </div>
                    {round.score && <div className="round-score">{round.score}</div>}
                  </div>
                ))}
              </div>
            </div>

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
                      <span>{candidate.resume}</span>
                    </div>
                    <span>{expandedDoc === "resume" ? "▲" : "▼"}</span>
                  </div>
                  <div className={`document-content ${expandedDoc !== "resume" ? "collapsed" : ""}`}>
                    <p>
                      Resume content preview would appear here. In a real application, this would display the actual
                      resume content or provide a download link.
                    </p>
                  </div>
                </div>

                <div className="document-item">
                  <div className="document-header" onClick={() => toggleDocument("cover")}>
                    <div className="document-title">
                      <span>📝</span>
                      <span>{candidate.coverLetter}</span>
                    </div>
                    <span>{expandedDoc === "cover" ? "▲" : "▼"}</span>
                  </div>
                  <div className={`document-content ${expandedDoc !== "cover" ? "collapsed" : ""}`}>
                    <p>
                      Cover letter content preview would appear here. In a real application, this would display the
                      actual cover letter content or provide a download link.
                    </p>
                  </div>
                </div>

                <div className="document-item">
                  <div
                    className="document-header"
                    onClick={() => isInterviewCompleted && toggleDocument("transcript")}
                    style={{ cursor: isInterviewCompleted ? "pointer" : "default" }}
                  >
                    <div className="document-title">
                      <span>🎙️</span>
                      <span>Interview Transcript</span>
                    </div>
                    {isInterviewCompleted ? (
                      <span>{expandedDoc === "transcript" ? "▲" : "▼"}</span>
                    ) : (
                      <span className="pending-badge">Pending</span>
                    )}
                  </div>
                  {isInterviewCompleted && (
                    <div className={`document-content ${expandedDoc !== "transcript" ? "collapsed" : ""}`}>
                      <p>
                        <strong>Final Interview Transcript</strong>
                        <br />
                        <br />
                        Interviewer: Thank you for joining us today. Let's start with your experience...
                        <br />
                        <br />
                        Candidate: {candidate.name}: Thank you for having me. I'm excited to discuss my background...
                        <br />
                        <br />
                        [Full transcript would be displayed here in a real application]
                      </p>
                    </div>
                  )}
                </div>

                {candidate.portfolio && (
                  <div className="document-item">
                    <div className="document-header" onClick={() => window.open(candidate.portfolio, "_blank")}>
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
            <div className="detail-section">
              <h3 className="section-title">
                <span className="section-icon">📝</span>
                Interview Notes
              </h3>
              <div className="notes-content notes-preview">
                <p>{candidate.notes?.substring(0, 150)}...</p>
                <button className="expand-notes-btn" onClick={() => setShowNotesModal(true)}>
                  Read Full Notes
                </button>
              </div>
            </div>

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

      {showNotesModal && (
        <div className="notes-modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h3>Interview Notes</h3>
              <button className="close-modal-btn" onClick={() => setShowNotesModal(false)}>
                ✕
              </button>
            </div>
            <div className="notes-modal-content">
              <p>{candidate.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateDetail
