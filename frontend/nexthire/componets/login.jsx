import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../src/services/api"; // Import the API service
import { getFileData } from "../src/utils/fileUtils"; // Import file utilities

const UserAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    qualification: "",
    experience: "",
    portfolio: "",
    skills: [],
    about: "",
    newPassword: "",
    confirmPassword: "",
    resume: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" && files && files[0]) {
      // Handle file upload
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Handle login
      try {
        setLoading(true);
        
        const credentials = {
          email: formData.email,
          password: formData.newPassword
        };
        
        const result = await authAPI.login(credentials);
        toast.success("Login successful!");
        console.log("Login result:", result);
        
        // Store token in localStorage
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        
        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        toast.error(`Login failed: ${error.message}`);
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle signup
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      
      try {
        setLoading(true);
        
        // Prepare data for signup (excluding confirm password)
        const { confirmPassword, resume, ...signupData } = formData;
        
        // For now, we'll send all data as JSON (resume info only)
        // In a real app, you would handle file uploads separately
        if (resume) {
          signupData.resume = getFileData(resume);
        }
        
        const result = await authAPI.signup(signupData);
        toast.success("Registration successful!");
        console.log("Signup result:", result);
        
        // Optionally auto-login after registration or redirect to login
        // For now, we'll switch to login view
        setIsLogin(true);
        setStep(1);
      } catch (error) {
        toast.error(`Registration failed: ${error.message}`);
        console.error("Signup error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-6">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 w-full max-w-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500">
          {isLogin ? "Login to NextHire" : "Create Your Account"}
        </h2>

        {isLogin ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-pink-500/50 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  required
                />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  required
                />
              </div>
            )}

            {/* Step 2: Education & Experience */}
            {step === 2 && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="qualification"
                  placeholder="Highest Qualification (e.g., B.Tech, MBA)"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="experience"
                  placeholder="Work Experience (e.g., 2 years)"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                />
                <input
                  type="text"
                  name="portfolio"
                  placeholder="Portfolio / GitHub / LinkedIn"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                />
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-purple-500 rounded-xl hover:scale-105 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-600 px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="text-gray-200 hover:text-white font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Final Step → About & Password & Resume */}
            {step === 4 && (
              <div className="space-y-4">
                <textarea
                  name="about"
                  placeholder="A little about yourself..."
                  value={formData.about}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400"
                  required
                />
                <div className="space-y-2">
                  <label className="text-gray-300">Upload Resume</label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    required
                  />
                  {formData.resume && (
                    <p className="text-sm text-gray-400">
                      Selected: {formData.resume.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-3 rounded-xl bg-gray-600 hover:bg-gray-500 transition"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="ml-auto px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-auto px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        )}

        {/* Toggle Login / Register */}
        <p className="text-center text-gray-400 mt-6">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span
                className="text-purple-400 cursor-pointer"
                onClick={() => {
                  setIsLogin(false);
                  setStep(1);
                }}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-purple-400 cursor-pointer"
                onClick={() => {
                  setIsLogin(true);
                  setStep(1);
                }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserAuth;