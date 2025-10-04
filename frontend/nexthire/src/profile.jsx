"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaBriefcase,
  FaClipboardList,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import accountLogo from "./assets/account-logo.svg";
import jobLogo from "./assets/job-logo.svg";
import "./styles/profilePage.css";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    dob: "1990-05-15",
    gender: "Male",
    mobile: "+1234567890",
    email: "john.doe@example.com",
    qualification: "Bachelor of Computer Science",
    experience: 5,
    portfolio: "https://johndoe.dev",
    skills: ["React", "Node.js", "TypeScript", "Next.js", "Tailwind CSS"],
    about:
      "Passionate full-stack developer with 5 years of experience building modern web applications. Specialized in React, Next.js, and Node.js ecosystems.",
    newPassword: "",
    confirmPassword: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setResumeError("Please upload a PDF file only");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size must be less than 5MB");
      return;
    }

    setResumeError("");
    setResumeFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleViewResume = () => {
    if (resumeFile) {
      const fileURL = URL.createObjectURL(resumeFile);
      window.open(fileURL, "_blank");
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeError("");
  };

  const handleSave = () => {
    // Validate passwords match if provided
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Saving profile data:", formData);
    console.log("Resume file:", resumeFile);
    setIsEditMode(false);
    // Here you would typically send data to your backend
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset form data to original values if needed
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };
  const navigate = useNavigate();

  return (
    <div className="app">
      {/* Backdrop */}
      {isMobile && isSidebarOpen && (
        <div className="backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

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

          {/* Navigation */}
          <nav className="nav-links">
            <a onClick={() => navigate("/dashboard")} className="nav-link">
              <FaHome />
              <span>Dashboard</span>
            </a>
            <a onClick={() => navigate("/jobs")} className="nav-link">
              <FaBriefcase />
              <span>Jobs</span>
            </a>
            <a onClick={() => navigate("/applications")} className="nav-link">
              <FaClipboardList />
              <span>Applications</span>
            </a>
            <a onClick={() => navigate("/profile")} className="nav-link active">
              <FaUser />
              <span>Profile</span>
            </a>
          </nav>

          {/* Logout */}
          <button className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mobile-header">
            <button
              className="hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <h2 className="mobile-title">My Profile</h2>
            <img src={accountLogo} alt="User" className="mobile-avatar" />
          </div>
        )}

        {/* Content Wrapper */}
        <div className="content-wrapper">
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">
              Manage your personal information and preferences
            </p>
          </div>

          <form className="form-container" onSubmit={(e) => e.preventDefault()}>
            {/* Personal Information Card */}
            <div className="card">
              <div className="card-title">
                <FaUser />
                Personal Information
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details Card */}
            <div className="card">
              <div className="card-title">
                <FaBriefcase />
                Professional Details
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Skills</label>
                  <div className="skills-container">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="skill-badge">
                        <span>{skill}</span>
                        {isEditMode && (
                          <button
                            type="button"
                            className="skill-remove-btn"
                            onClick={() => handleSkillRemove(skill)}
                          >
                            <FaTimes size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section Card */}
            <div className="card">
              <div className="card-title">About Me</div>
              <div className="form-grid single-column">
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className="form-textarea"
                    rows="5"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              {!isEditMode ? (
                <button
                  type="button"
                  className="btn btn-edit"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
