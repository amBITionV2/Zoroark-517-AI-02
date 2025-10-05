"use client"

import { useState, useRef, useEffect } from "react"
import "./adminStyles/profileSettings.css"

export default function ProfileSettings() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "Naman Agarwal",
    email: "naman@example.com",
    password: "",
    confirmPassword: "",
    designation: "Software Engineer",
    companyName: "Tech Corp",
    companyLocation: "San Francisco, CA",
  })

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Click outside detection for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    // Validate passwords match if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    
    // Save to localStorage
    localStorage.setItem("profileSettings", JSON.stringify(formData))
    alert("Profile settings saved successfully!")
    setIsEditMode(false)
  }

  const handleCancel = () => {
    // Reset form to saved data
    const saved = localStorage.getItem("profileSettings")
    if (saved) {
      setFormData(JSON.parse(saved))
    }
    setIsEditMode(false)
  }

  // Get initials from full name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="profile-settings-container">
      {/* Header Section */}
      <div className="profile-settings-header">
        <div>
          <h1 className="profile-settings-title">Account Settings</h1>
          <p className="profile-settings-subtitle">
            Update your profile information. Changes are saved to your browser.
          </p>
        </div>

        {/* User Avatar with Dropdown */}
        <div className="user-avatar-container" ref={dropdownRef}>
          <button className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="User menu">
            {getInitials(formData.fullName)}
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Dashboard</button>
              <button className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="profile-settings-grid">
        {/* Edit Profile Form */}
        <div className="edit-profile-section">
          <form onSubmit={handleSave}>
            {/* Personal Section */}
            <div className="form-section">
              <h2 className="section-title">Personal Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditMode}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditMode}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="••••••••"
                  disabled={!isEditMode}
                />
                <p className="form-helper-text">Leave blank to keep your current password</p>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="••••••••"
                  disabled={!isEditMode}
                />
              </div>
            </div>

            {/* Company Section */}
            <div className="form-section">
              <h2 className="section-title">Company Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="designation" className="form-label">
                    Designation <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditMode}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditMode}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="companyLocation" className="form-label">
                  Company Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="companyLocation"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditMode}
                  required
                />
              </div>
            </div>

            {/* Edit/Action Buttons */}
            {!isEditMode ? (
              <button type="button" className="edit-btn" onClick={handleEdit}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Save changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Profile Preview Card */}
        <div className="profile-preview-card">
          <div className="preview-avatar">{getInitials(formData.fullName)}</div>

          <div className="preview-content">
            <div className="preview-field">
              <p className="preview-label">Your Name</p>
              <p className="preview-value">{formData.fullName}</p>
            </div>

            <div className="preview-field">
              <p className="preview-label">Your Role - Company</p>
              <p className="preview-value">
                {formData.designation} - {formData.companyName}
              </p>
            </div>

            <div className="preview-field">
              <p className="preview-label">Company Location</p>
              <p className="preview-value">{formData.companyLocation}</p>
            </div>

            <div className="preview-field">
              <p className="preview-label">Email</p>
              <p className="preview-value">{formData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}