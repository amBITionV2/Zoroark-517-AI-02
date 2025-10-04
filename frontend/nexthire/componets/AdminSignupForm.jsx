"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../src/styles/globals.css"

export default function AdminSignupForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [apiError, setApiError] = useState("")
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    companyDescription: "",
    position: "",
    department: "",
    contactNumber: "",
    profileImage: null,
    profileImageUrl: "",
    linkedinProfile: "",
    termsAccepted: false,
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({ level: "", score: 0 })
  const [imagePreview, setImagePreview] = useState(null)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^\+91-\d{10}$/
    return phoneRegex.test(phone)
  }

  const calculatePasswordStrength = (password) => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { level: "weak", score: 33 }
    if (score <= 3) return { level: "medium", score: 66 }
    return { level: "strong", score: 100 }
  }

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password))
    } else {
      setPasswordStrength({ level: "", score: 0 })
    }
  }, [formData.password])

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() === "" ? "Name is required" : ""
      case "email":
        if (value.trim() === "") return "Email is required"
        return !validateEmail(value) ? "Invalid email format" : ""
      case "password":
        if (value.trim() === "") return "Password is required"
        return value.length < 8 ? "Password must be at least 8 characters" : ""
      case "confirmPassword":
        if (value.trim() === "") return "Please confirm your password"
        return value !== formData.password ? "Passwords do not match" : ""
      case "companyName":
        return value.trim() === "" ? "Company name is required" : ""
      case "companyWebsite":
        if (value.trim() === "") return "Company website is required"
        return !validateUrl(value) ? "Invalid URL format" : ""
      case "companyLocation":
        return value.trim() === "" ? "Company location is required" : ""
      case "companyDescription":
        if (value.trim() === "") return "Company description is required"
        return value.length > 500 ? "Description must be 500 characters or less" : ""
      case "position":
        return value.trim() === "" ? "Position is required" : ""
      case "department":
        return value.trim() === "" ? "Department is required" : ""
      case "contactNumber":
        if (value.trim() === "") return "Contact number is required"
        return !validatePhone(value) ? "Invalid format. Use +91-XXXXXXXXXX" : ""
      case "linkedinProfile":
        if (value.trim() !== "" && !validateUrl(value)) return "Invalid URL format"
        return ""
      case "termsAccepted":
        return !value ? "You must accept the terms and conditions" : ""
      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file") {
      const file = files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, profileImage: "File size must be less than 5MB" })
          return
        }
        if (!file.type.startsWith("image/")) {
          setErrors({ ...errors, profileImage: "Only image files are allowed" })
          return
        }
        setFormData({ ...formData, profileImage: file })
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
        setErrors({ ...errors, profileImage: "" })
      }
    } else {
      const newValue = type === "checkbox" ? checked : value
      setFormData({ ...formData, [name]: newValue })

      if (touched[name]) {
        const error = validateField(name, newValue)
        setErrors({ ...errors, [name]: error })
      }
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, profileImage: "File size must be less than 5MB" })
        return
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, profileImage: "Only image files are allowed" })
        return
      }
      setFormData({ ...formData, profileImage: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setErrors({ ...errors, profileImage: "" })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    let fieldsToValidate = []

    if (step === 1) {
      fieldsToValidate = ["name", "email", "password", "confirmPassword"]
    } else if (step === 2) {
      fieldsToValidate = ["companyName", "companyWebsite", "companyLocation", "companyDescription"]
    } else if (step === 3) {
      fieldsToValidate = ["position", "department", "contactNumber"]
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    setErrors({ ...errors, ...newErrors })
    setTouched({
      ...touched,
      ...fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
    })

    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleClearAll = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyWebsite: "",
      companyLocation: "",
      companyDescription: "",
      position: "",
      department: "",
      contactNumber: "",
      profileImage: null,
      profileImageUrl: "",
      linkedinProfile: "",
      termsAccepted: false,
    })
    setErrors({})
    setTouched({})
    setImagePreview(null)
    setCurrentStep(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const allFields = [
      "name",
      "email",
      "password",
      "confirmPassword",
      "companyName",
      "companyWebsite",
      "companyLocation",
      "companyDescription",
      "position",
      "department",
      "contactNumber",
      "termsAccepted",
    ]

    const newErrors = {}
    allFields.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
      return
    }

    setIsSubmitting(true)
    setApiError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      setShowSuccess(true)
      setTimeout(() => {
        onNavigateToLogin()
      }, 3000)
    } catch (error) {
      setApiError(error.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Personal Information</h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="Enter your full name"
              />
              {touched.name && errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="your.email@company.com"
              />
              {touched.email && errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="Minimum 8 characters"
              />
              {touched.password && errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#F8FAFC]">Password Strength:</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.level === "weak"
                          ? "text-red-400"
                          : passwordStrength.level === "medium"
                            ? "text-yellow-400"
                            : "text-[#22D3EE]"
                      }`}
                    >
                      {passwordStrength.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#161B33] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.level === "weak"
                          ? "bg-red-400"
                          : passwordStrength.level === "medium"
                            ? "bg-yellow-400"
                            : "bg-gradient-to-r from-[#22D3EE] to-[#6366F1]"
                      }`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="Re-enter your password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Company Information</h2>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="Your company name"
              />
              {touched.companyName && errors.companyName && (
                <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Company Website *
              </label>
              <input
                type="url"
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="https://www.company.com"
              />
              {touched.companyWebsite && errors.companyWebsite && (
                <p className="mt-1 text-sm text-red-400">{errors.companyWebsite}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyLocation" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Company Location *
              </label>
              <input
                type="text"
                id="companyLocation"
                name="companyLocation"
                value={formData.companyLocation}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="City, State, Country"
              />
              {touched.companyLocation && errors.companyLocation && (
                <p className="mt-1 text-sm text-red-400">{errors.companyLocation}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyDescription" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Company Description *
              </label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all resize-none"
                placeholder="Brief description of your company..."
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {touched.companyDescription && errors.companyDescription && (
                    <p className="text-sm text-red-400">{errors.companyDescription}</p>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8]">{formData.companyDescription.length}/500</p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">Professional Details</h2>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Position/Job Title *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="e.g., Senior Manager"
              />
              {touched.position && errors.position && <p className="mt-1 text-sm text-red-400">{errors.position}</p>}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="e.g., Human Resources"
              />
              {touched.department && errors.department && (
                <p className="mt-1 text-sm text-red-400">{errors.department}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="+91-9876543210"
              />
              {touched.contactNumber && errors.contactNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.contactNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F8FAFC] mb-2">Profile Image</label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[rgba(99,102,241,0.2)] rounded-lg p-6 text-center hover:border-[#6366F1] hover:bg-[rgba(99,102,241,0.05)] transition-all cursor-pointer"
              >
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-[#6366F1] shadow-lg shadow-[rgba(99,102,241,0.3)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData({ ...formData, profileImage: null })
                      }}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-12 w-12 text-[#94A3B8]"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4">
                      <label
                        htmlFor="profileImage"
                        className="cursor-pointer text-[#F8FAFC] hover:text-[#22D3EE] transition-colors"
                      >
                        <span className="font-medium">Upload a file</span>
                        <span className="text-[#94A3B8]"> or drag and drop</span>
                      </label>
                      <input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-2">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              {errors.profileImage && <p className="mt-1 text-sm text-red-400">{errors.profileImage}</p>}
            </div>

            <div>
              <label htmlFor="linkedinProfile" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                id="linkedinProfile"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="https://www.linkedin.com/in/yourprofile"
              />
              {touched.linkedinProfile && errors.linkedinProfile && (
                <p className="mt-1 text-sm text-red-400">{errors.linkedinProfile}</p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-4">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-[#6366F1] bg-[#161B33] text-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-[#1E2749]"
              />
              <label htmlFor="termsAccepted" className="text-sm text-[#F8FAFC]">
                I accept the{" "}
                <a href="#" className="text-[#22D3EE] hover:text-[#6366F1] underline transition-colors">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#22D3EE] hover:text-[#6366F1] underline transition-colors">
                  Privacy Policy
                </a>
                *
              </label>
            </div>
            {touched.termsAccepted && errors.termsAccepted && (
              <p className="text-sm text-red-400">{errors.termsAccepted}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0A0E27 0%, #0D1229 50%, #161B33 100%)" }}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { num: 1, label: "Personal" },
              { num: 2, label: "Company" },
              { num: 3, label: "Professional" },
            ].map((step, index) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.num
                        ? "text-white shadow-lg shadow-[rgba(99,102,241,0.5)]"
                        : "bg-[#161B33] text-[#94A3B8] border border-[rgba(99,102,241,0.2)]"
                    }`}
                    style={
                      currentStep >= step.num ? { background: "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)" } : {}
                    }
                  >
                    {step.num}
                  </div>
                  <span className="text-xs text-[#94A3B8] mt-2 text-center">{step.label}</span>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 transition-all rounded-full ${currentStep > step.num ? "" : "bg-[#161B33]"}`}
                    style={{
                      background: currentStep > step.num ? "linear-gradient(90deg, #6366F1 0%, #22D3EE 100%)" : "",
                      marginTop: "-24px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg shadow-2xl p-8 border border-[rgba(99,102,241,0.2)]"
          style={{ background: "linear-gradient(135deg, #1E2749 0%, #161B33 100%)" }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Admin Registration</h1>
            <p className="text-[#94A3B8]">Create your admin account to get started</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-[#161B33] text-[#F8FAFC] rounded-lg border border-[rgba(99,102,241,0.2)] hover:border-[#6366F1] hover:bg-[rgba(99,102,241,0.1)] transition-all font-medium"
                >
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)")
                  }
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.termsAccepted}
                  className="flex-1 px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)",
                  }}
                  onMouseEnter={(e) =>
                    !e.currentTarget.disabled &&
                    (e.currentTarget.style.background = "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)")
                  }
                  onMouseLeave={(e) =>
                    !e.currentTarget.disabled &&
                    (e.currentTarget.style.background = "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)")
                  }
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
              >
                Clear All Fields
              </button>
              <button
                type="button"
                onClick={ () => navigate ('/adminLoginForm') }
                className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="rounded-lg p-8 max-w-md w-full text-center border border-[rgba(99,102,241,0.3)] shadow-2xl"
            style={{ background: "linear-gradient(135deg, #1E2749 0%, #161B33 100%)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">Registration Successful!</h3>
            <p className="text-[#94A3B8] mb-4">
              Your admin account has been created successfully. Redirecting to login...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
