"use client"

import { useState } from "react"
import "../src/styles/globals.css"
import { useNavigate } from "react-router-dom"
//


export default function AdminLoginForm( ) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Validation errors state
  const [errors, setErrors] = useState({})

  // Touched fields state
  const [touched, setTouched] = useState({})

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (value.trim() === "") return "Email is required"
        return !validateEmail(value) ? "Invalid email format" : ""
      case "password":
        if (value.trim() === "") return "Password is required"
        return value.length < 8 ? "Password must be at least 8 characters" : ""
      default:
        return ""
    }
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData({ ...formData, [name]: newValue })

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, newValue)
      setErrors({ ...errors, [name]: error })
    }
  }

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const allFields = ["email", "password"]
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
      // Make API call to login admin
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("adminToken", result.token)
        // Redirect to admin dashboard
        navigate("/adminDashboard")
      } else {
        setApiError(result.message || "Login failed. Please try again.")
      }
    } catch (error) {
      setApiError(error.message || "Login failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0A0E27 0%, #0D1229 50%, #161B33 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Form Card */}
        <div
          className="rounded-lg shadow-2xl p-8 border border-[rgba(99,102,241,0.2)]"
          style={{ background: "linear-gradient(135deg, #1E2749 0%, #161B33 100%)" }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, #22D3EE 0%, #6366F1 100%)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Admin Login</h1>
            <p className="text-[#94A3B8]">Welcome back! Please login to your account</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Email Address
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                placeholder="Enter your password"
              />
              {touched.password && errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#6366F1] bg-[#161B33] text-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-[#1E2749]"
                />
                <label htmlFor="rememberMe" className="text-sm text-[#F8FAFC]">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#22D3EE] hover:text-[#6366F1] transition-colors">
                Forgot password?
              </a>
            </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#F8FAFC] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 bg-[#161B33] border border-[rgba(99,102,241,0.2)] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[rgba(99,102,241,0.15)] transition-all"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="px-4 py-3 bg-[#161B33] text-[#F8FAFC] rounded-lg border border-[rgba(99,102,241,0.2)] hover:border-[#6366F1] hover:bg-[rgba(99,102,241,0.1)] transition-all font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#F8FAFC]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-[#22D3EE] hover:text-[#6366F1] transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-[#94A3B8]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/adminSignupForm")}
                  className="text-[#22D3EE] hover:text-[#6366F1] transition-colors font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}