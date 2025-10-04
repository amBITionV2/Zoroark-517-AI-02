"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiBriefcase,
  FiBookmark,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import { FaHome, FaBriefcase, FaClipboardList, FaUser as FaUserSolid, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import "./styles/joblistPage.css";
import accountLogo from "./assets/account-logo.svg";
import jobLogo from "./assets/job-logo.svg";

// Mock job data
const jobListings = [
  {
    id: 1,
    company: "TechCorp",
    logo: "/tech-company-logo.jpg",
    title: "Senior Frontend Developer",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    posted: "2 days ago",
    description:
      "We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using modern frameworks.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
  },
  {
    id: 2,
    company: "DataFlow Inc",
    logo: "/data-company-logo.png",
    title: "Data Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "$130k - $170k",
    posted: "1 week ago",
    description:
      "Join our data team to build scalable data pipelines and infrastructure. Experience with cloud platforms and big data technologies required.",
    skills: ["Python", "AWS", "Spark", "SQL"],
  },
  {
    id: 3,
    company: "DesignHub",
    logo: "/generic-company-logo.png",
    title: "UX/UI Designer",
    location: "New York, NY",
    type: "Contract",
    salary: "$90k - $120k",
    posted: "3 days ago",
    description:
      "Create beautiful and intuitive user experiences for our suite of products. Collaborate with product managers and developers to bring designs to life.",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
  },
  {
    id: 4,
    company: "CloudSystems",
    logo: "/cloud-company-logo.png",
    title: "DevOps Engineer",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140k - $180k",
    posted: "5 days ago",
    description:
      "Manage and optimize our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability and security.",
    skills: ["Kubernetes", "Docker", "Terraform", "Jenkins"],
  },
  {
    id: 5,
    company: "MobileFirst",
    logo: "/generic-mobile-logo.png",
    title: "iOS Developer",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110k - $150k",
    posted: "1 day ago",
    description:
      "Build native iOS applications with a focus on performance and user experience. Work with cross-functional teams to deliver high-quality mobile apps.",
    skills: ["Swift", "SwiftUI", "Core Data", "REST APIs"],
  },
  {
    id: 6,
    company: "SecureNet",
    logo: "/security-company-logo.png",
    title: "Security Analyst",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$100k - $140k",
    posted: "4 days ago",
    description:
      "Monitor and protect our systems from security threats. Conduct vulnerability assessments and implement security best practices.",
    skills: ["Cybersecurity", "Penetration Testing", "SIEM", "Compliance"],
  },
  {
    id: 7,
    company: "AILabs",
    logo: "/ai-company-logo.png",
    title: "Machine Learning Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "$150k - $200k",
    posted: "6 days ago",
    description:
      "Develop and deploy machine learning models at scale. Work on cutting-edge AI projects with a talented research team.",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
  },
  {
    id: 8,
    company: "GameStudio",
    logo: "/game-company-logo.jpg",
    title: "Game Developer",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$95k - $135k",
    posted: "1 week ago",
    description:
      "Create immersive gaming experiences using Unity or Unreal Engine. Collaborate with artists and designers to bring game concepts to life.",
    skills: ["Unity", "C#", "Game Design", "3D Graphics"],
  },
  {
    id: 9,
    company: "FinTech Solutions",
    logo: "/fintech-logo.png",
    title: "Backend Developer",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$115k - $155k",
    posted: "2 days ago",
    description:
      "Build robust and scalable backend systems for financial applications. Ensure high performance and security standards.",
    skills: ["Node.js", "PostgreSQL", "Microservices", "Redis"],
  },
];

export default function Joblist() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobile, isSidebarOpen]);

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

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
          <div className="flex flex-col items-center gap-3 mb-6">
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

          {/* Navigation */}
          <nav className="nav-links">
            <a 
              onClick={() => navigate("/dashboard")}
              className="nav-link"
            >
              <FaHome /> Dashboard
            </a>
            <a onClick={() => navigate("/jobs")} className="nav-link active">
              <FaBriefcase /> Jobs
            </a>
            <a 
              onClick={() => navigate("/applications")}
              className="nav-link"
            >
              <FaClipboardList /> Applications
            </a>
            <a onClick={() => navigate("/profile")} className="nav-link">
              <FaUserSolid /> Profile
            </a>
          </nav>

          {/* Logout */}
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
            <h2 className="mobile-title">nextHire</h2>
            <img src={accountLogo} alt="User" className="mobile-avatar" />
          </div>
        )}

        {/* Content Wrapper */}
        <div className="content-wrapper">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Find Your Dream Job</h1>
            <p className="page-subtitle">Browse through {jobListings.length} available positions</p>
          </div>

          {/* Job Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListings.map((job) => (
              <div key={job.id} className="job-card">
                {/* Company Logo and Bookmark */}
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={jobLogo}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 rounded-lg"
                  />
                  <button
                    onClick={() => toggleBookmark(job.id)}
                    className={`bookmark-btn ${
                      bookmarkedJobs.has(job.id) ? "bookmarked" : ""
                    }`}
                  >
                    <FiBookmark
                      fill={bookmarkedJobs.has(job.id) ? "#ECDFCC" : "none"}
                    />
                  </button>
                </div>

                {/* Job Title and Company */}
                <h3 className="text-xl font-semibold mb-1 text-primary">
                  {job.title}
                </h3>
                <p className="text-sm mb-4 text-secondary">{job.company}</p>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="job-detail">
                    <FiMapPin size={16} className="detail-icon" />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail">
                    <FiBriefcase size={16} className="detail-icon" />
                    <span>{job.type}</span>
                  </div>
                  <div className="job-detail">
                    <FiDollarSign size={16} className="detail-icon" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="job-detail">
                    <FiClock size={16} className="detail-icon" />
                    <span>{job.posted}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 line-clamp-3 text-secondary">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Apply Button */}
                <button className="apply-btn">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}