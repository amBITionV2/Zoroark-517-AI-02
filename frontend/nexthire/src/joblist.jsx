"use client"

import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiBriefcase,
  FiBookmark,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
} from "react-icons/fi"
import "./styles/joblistPage.css"
import accountLogo from "./assets/account-logo.svg"
import jobLogo from "./assets/job-logo.svg"

export default function Joblist() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set())
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // User JWT from login
        const res = await fetch("http://localhost:5000/api/auth/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Protect route
          },
        });

        const data = await res.json();
        console.log(data);
        if (data.success) {
          setJobs(data.jobs);
        } else {
          console.error("Error fetching jobs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading jobs...</p>
        </div>
      </div>
    );
  }

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const handleApply = (job) => {
    navigate("/jobs/rules", { state: { job } });
  }

  const handleNavigation = (path) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="app">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors mobile-menu-btn"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 w-64 sidebar
        `}
      >
        <div className="sidebar-content">
          {/* User Profile */}
          <div className="user-section">
            <div className="flex flex-col items-center gap-3 mb-6">
              <img src={accountLogo} alt="User" className="user-avatar" />
              <div>
                <h3 className="user-name">John Doe</h3>
                <p className="text-sm text-secondary">Job Seeker</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav-links">
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleNavigation('/jobs')} className="nav-link nav-link-active">
                  <FiBriefcase size={20} />
                  <span>Jobs</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/dashboard')} className="nav-link">
                  <FiHome size={20} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/applications')} className="nav-link">
                  <FiBookmark size={20} />
                  <span>Applied Jobs</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('/profile')} className="nav-link">
                  <FiUser size={20} />
                  <span>Profile</span>
                </button>
              </li>
              <li>
                
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="logout-btn w-full mt-auto"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Find Your Dream Job</h1>
          <p className="page-subtitle">Browse through {jobs.length} available positions</p>
        </div>


        {/* Job Grid */}
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.jobId} className="job-card">
              {/* Company Logo and Bookmark */}
              <div className="job-card-header">
                <img
                  src={jobLogo}
                  alt={`${job.companyName} logo`}
                  className="company-logo"
                />
                <button
                  onClick={() => toggleBookmark(job.jobId)}
                  className={`bookmark-btn ${bookmarkedJobs.has(job.jobId) ? "bookmarked" : ""}`}
                >
                  <FiBookmark size={20} fill={bookmarkedJobs.has(job.jobId) ? "#ECDFCC" : "none"} />
                </button>
              </div>

              {/* Job Title and Company */}
              <h3 className="job-title">{job.role}</h3>
              <p className="company-name">{job.companyName}</p>

              {/* Job Details */}
              <div className="job-details">
                <div className="job-detail">
                  <FiMapPin size={16} className="detail-icon" />
                  <span>{job.location}</span>
                </div>
                <div className="job-detail">
                  <FiBriefcase size={16} className="detail-icon" />
                  <span>{job.jobType}</span>
                </div>
                <div className="job-detail">
                  <FiDollarSign size={16} className="detail-icon" />
                  <span>{job.salary}</span>
                </div>
                <div className="job-detail">
                  <FiClock size={16} className="detail-icon" />
                  <span>{job.experienceRequired}</span>
                </div>
              </div>

              {/* Description */}
              <p className="job-description">{job.jobDescription}</p>

              {/* Skills */}
              <div className="skills-container">
                {job.skillsRequired && job.skillsRequired.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Apply Button */}
              <button 
                onClick={() => handleApply(job)}
                className="apply-btn"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}