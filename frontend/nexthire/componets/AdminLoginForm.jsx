"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../src/styles/globals.css"

export default function AdminLoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (value.trim() === "") return "Email is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? "Invalid email format" : ""
      case "password":
        return value.trim() === "" ? "Password is required" : ""
      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
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
      setApiError("Network error. Please try again.")
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
        <div
          className="rounded-lg shadow-2xl p-8 border border-[rgba(99,102,241,0.2)]"
          style={{ background: "linear-gradient(135deg, #1E2749 0%, #161B33 100%)" }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Admin Login</h1>
            <p className="text-[#94A3B8]">Sign in to your admin account</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#6366F1] bg-[#161B33] text-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-[#1E2749]"
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
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#94A3B8]">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/adminSignup")}
                className="text-[#22D3EE] hover:text-[#6366F1] font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}