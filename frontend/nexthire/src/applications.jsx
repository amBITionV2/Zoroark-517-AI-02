"use client"

import { useState, useEffect } from "react"
import {
  FaHome,
  FaBriefcase,
  FaClipboardList,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa"
import "./styles/applicationsPage.css"
import { useNavigate } from "react-router-dom"
import accountLogo from "./assets/account-logo.svg";
import jobLogo from "./assets/job-logo.svg";

// Mock application data

const mockApplications = [
  {
    id: 1,
    company: "Google",
    jobTitle: "Senior Frontend Engineer",
    applicationDate: "2024-03-15",
    status: "Pending",
    logo: "/google-logo.png",
  },
  {
    id: 2,
    company: "Microsoft",
    jobTitle: "Full Stack Developer",
    applicationDate: "2024-03-10",
    status: "Accepted",
    scores: {
      resume: 85,
      mcq: 90,
      coding: 88,
      total: 263,
    },
    strengths: ["React", "Node.js", "TypeScript", "Problem Solving", "System Design"],
    missingSkills: ["AWS", "GraphQL"],
    recommendations: [
      "Consider taking an AWS certification course",
      "Build a project using GraphQL to strengthen your skills",
      "Practice more system design interviews",
      "Contribute to open-source projects using these technologies",
    ],
    logo: "/microsoft-logo.png",
  },
  {
    id: 3,
    company: "Amazon",
    jobTitle: "Software Development Engineer",
    applicationDate: "2024-03-08",
    status: "Rejected",
    scores: {
      resume: 70,
      mcq: 65,
      coding: 68,
      total: 203,
    },
    strengths: ["JavaScript", "React", "Problem Solving"],
    missingSkills: ["Kubernetes", "Microservices", "Distributed Systems"],
    recommendations: [
      "Study distributed systems architecture",
      "Learn Kubernetes and container orchestration",
      "Practice more algorithmic problem solving",
      "Gain experience with microservices patterns",
      "Work on scalability challenges",
    ],
    logo: "/amazon-logo.png",
  },
  {
    id: 4,
    company: "Meta",
    jobTitle: "Frontend Engineer",
    applicationDate: "2024-03-05",
    status: "Pending",
    logo: "/meta-logo-abstract.png",
  },
  {
    id: 5,
    company: "Apple",
    jobTitle: "Software Engineer",
    applicationDate: "2024-03-01",
    status: "Accepted",
    scores: {
      resume: 88,
      mcq: 92,
      coding: 90,
      total: 270,
    },
    strengths: ["Swift", "React Native", "UI/UX Design", "Performance Optimization"],
    missingSkills: ["Metal API", "Core ML"],
    recommendations: [
      "Explore Metal API for graphics programming",
      "Learn Core ML for machine learning integration",
      "Study Apple Human Interface Guidelines in depth",
      "Build more native iOS applications",
    ],
    logo: "/apple-logo.png",
  },
  {
    id: 6,
    company: "Netflix",
    jobTitle: "Senior Full Stack Developer",
    applicationDate: "2024-02-28",
    status: "Rejected",
    scores: {
      resume: 72,
      mcq: 68,
      coding: 70,
      total: 210,
    },
    strengths: ["React", "Node.js", "MongoDB"],
    missingSkills: ["Kafka", "Redis", "Video Streaming Technologies"],
    recommendations: [
      "Learn Apache Kafka for event streaming",
      "Gain experience with Redis caching strategies",
      "Study video streaming protocols and CDN technologies",
      "Practice building high-scale distributed systems",
      "Improve data structure and algorithm skills",
    ],
    logo: "/netflix-inspired-logo.png",
  },
]

function Applications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [expandedCards, setExpandedCards] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("Date")
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isSidebarOpen])

  const toggleCard = (id) => {
    setExpandedCards((prev) => (prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]))
  }

  const filteredApplications = mockApplications
    .filter((app) => filterStatus === "All" || app.status === filterStatus)
    .filter(
      (app) =>
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "Date") {
        return new Date(b.applicationDate) - new Date(a.applicationDate)
      } else if (sortBy === "Score") {
        const scoreA = a.scores?.total || 0
        const scoreB = b.scores?.total || 0
        return scoreB - scoreA
      }
      return 0
    })

  return (
    <div className="app">
      {/* Backdrop */}
      {isMobile && isSidebarOpen && <div className="backdrop" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobile && isSidebarOpen ? "open" : ""}`}>
        {isMobile && (
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes />
          </button>
        )}

        <div className="flex flex-col h-full p-6">
                  {/* User Profile */}
                  <div className="mb-8">
                    <div className="flex flex-col items-center gap-3 mb-6">
                      <img
                        src={accountLogo}
                        alt="User"
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="text-center">
                        <h3 className="font-semibold text-primary">John Doe</h3>
                        <p className="text-sm text-secondary">Job Seeker</p>
                      </div>
                    </div>
                  </div>    

          <nav className="nav-links">
            <a className="nav-link" onClick={() => navigate("/dashboard")}>
              <FaHome /> Dashboard
            </a>
            <a className="nav-link" onClick={() => navigate("/jobs")}>
              <FaBriefcase /> Jobs
            </a>
            <a href="#" className="nav-link active">
              <FaClipboardList /> Applications
            </a>
            <a onClick={() => navigate("/profile")} className="nav-link">
              <FaUser /> Profile
            </a>
          </nav>

          <button className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mobile-header">
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
              <FaBars />
            </button>
            <h2 className="mobile-title">Application Tracker</h2>
            <img src="/diverse-user-avatars.png" alt="User" className="mobile-avatar" />
          </div>
        )}

        <div className="content-wrapper">
          <div className="page-header">
            <h1 className="page-title">Application Tracker</h1>
            <p className="page-subtitle">Monitor your job application status and performance</p>
          </div>

          <div className="filters-section">
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by company or job title..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Date">Sort by Date</option>
              <option value="Score">Sort by Score</option>
            </select>
          </div>

          <div className="applications-list">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                isExpanded={expandedCards.includes(app.id)}
                onToggle={() => toggleCard(app.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function ApplicationCard({ application, isExpanded, onToggle }) {
  const { company, jobTitle, applicationDate, status, scores, strengths, missingSkills, recommendations, logo } =
    application

  const getStatusColor = () => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Accepted":
        return "status-accepted"
      case "Rejected":
        return "status-rejected"
      default:
        return ""
    }
  }

  return (
    <div className={`application-card ${isExpanded ? "expanded" : ""}`}>
      <div className="card-header" onClick={onToggle}>
        <img src={jobLogo} alt={`${company} logo`} className="company-logo" />

        <div className="card-info">
          <h3 className="job-title">{jobTitle}</h3>
          <p className="company-name">{company}</p>
          <p className="application-date">{new Date(applicationDate).toLocaleDateString()}</p>
        </div>

        <div className="card-actions">
          <span className={`status-badge ${getStatusColor()}`}>
            {status}
            {scores && ` - Score: ${scores.total}/300`}
          </span>
          {isExpanded ? <FaChevronUp className="chevron" /> : <FaChevronDown className="chevron" />}
        </div>
      </div>

      {isExpanded && (status === "Accepted" || status === "Rejected") && (
        <div className="card-details">
          {scores && (
            <div className="score-section">
              <h4 className="section-title">Score Breakdown</h4>
              <div className="score-bars">
                <ScoreBar label="Resume" score={scores.resume} max={100} />
                <ScoreBar label="MCQ" score={scores.mcq} max={100} />
                <ScoreBar label="Coding" score={scores.coding} max={100} />
                <ScoreBar label="Total" score={scores.total} max={300} />
              </div>
            </div>
          )}

          {strengths && (
            <div className="strengths-section">
              <h4 className="section-title">Strengths</h4>
              <div className="badges">
                {strengths.map((strength, idx) => (
                  <span key={idx} className="strength-badge">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills && (
            <div className="missing-skills-section">
              <h4 className="section-title">Missing Skills</h4>
              <div className="badges">
                {missingSkills.map((skill, idx) => (
                  <span key={idx} className="missing-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recommendations && (
            <div className="recommendations-section">
              <h4 className="section-title">Recommendations</h4>
              <ul className="recommendations-list">
                {recommendations.map((rec, idx) => (
                  <li key={idx}>
                    <FaArrowRight className="arrow-icon" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreBar({ label, score, max }) {
  const percentage = (score / max) * 100

  return (
    <div className="score-bar-container">
      <div className="score-bar-header">
        <span className="score-label">{label}</span>
        <span className="score-value">
          {score}/{max}
        </span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default Applications
