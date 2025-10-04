import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function landingpage() {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, redirect to dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  // Function to handle admin login
  const handleAdminLogin = () => {
    toast.info("Admin login feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          NextHire
        </h1>
        <p className="text-lg max-w-2xl mt-4 text-gray-300">
          The <span className="text-purple-400 font-semibold">AI-powered hiring platform </span> 
          for modern companies. Take interviews, evaluate talent, and hire smarter.
        </p>
        <div className="mt-10 flex gap-6">
          <button 
            onClick={handleAdminLogin}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-pink-500/50 hover:cursor-pointer transition"
          >
            Login as Admin
          </button>
          <Link to="/user" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:cursor-pointer hover:shadow-blue-500/50 transition">
            Login as User
          </Link>
        </div>
      </header>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Why Choose <span className="text-purple-400">NextHire?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3 text-purple-400">AI-Powered Interviews</h3>
            <p className="text-gray-300">Automated candidate screening and smart insights to make data-driven hiring decisions.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Faster Hiring</h3>
            <p className="text-gray-300">Streamline recruitment workflows and reduce time-to-hire with intelligent tools.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-2xl shadow-lg hover:shadow-green-500/40 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3 text-green-400">Seamless Experience</h3>
            <p className="text-gray-300">Intuitive, user-friendly platform that makes interviews smooth for both admins and candidates.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-700">
        © {new Date().getFullYear()} NextHire • Built for the future of hiring 🚀
      </footer>
    </div>
  );
}

export default landingpage;