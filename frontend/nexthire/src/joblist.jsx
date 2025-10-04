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
import "./globals.css"
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
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading jobs...</div>;
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

  return (
    <div className="min-h-screen job-listing-bg">
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
          md:translate-x-0 w-64 sidebar-bg
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* User Profile */}
          <div className="mb-8">
            <div className="flex flex-col items-center gap-3 mb-6">
              <img src={accountLogo} alt="User" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="font-semibold text-primary">John Doe</h3>
                <p className="text-sm text-secondary">Job Seeker</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <a href="#" className="nav-link nav-link-active">
                  <FiBriefcase size={20} />
                  <span>Jobs</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <FiHome size={20} />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <FiBookmark size={20} />
                  <span>applied Jobs</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <FiUser size={20} />
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <FiSettings size={20} />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="nav-link w-full mt-auto"
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
      <main className="md:ml-64 p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">Find Your Dream Job</h1>
          <p className="text-lg text-secondary">Browse through {jobs.length} available positions</p>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.jobId} className="job-card">
              {/* Company Logo and Bookmark */}
              <div className="flex items-start justify-between mb-4">
                <img
                  src={jobLogo}
                  alt={`${job.companyName} logo`}
                  className="w-12 h-12 rounded-lg"
                />
                <button
                  onClick={() => toggleBookmark(job.jobId)}
                  className={`bookmark-btn ${bookmarkedJobs.has(job.jobId) ? "bookmarked" : ""}`}
                >
                  <FiBookmark size={20} fill={bookmarkedJobs.has(job.jobId) ? "#ECDFCC" : "none"} />
                </button>
              </div>

              {/* Job Title and Company */}
              <h3 className="text-xl font-semibold mb-1 text-primary">{job.role}</h3>
              <p className="text-sm mb-4 text-secondary">{job.companyName}</p>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
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
              <p className="text-sm mb-4 line-clamp-3 text-secondary">{job.jobDescription}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
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