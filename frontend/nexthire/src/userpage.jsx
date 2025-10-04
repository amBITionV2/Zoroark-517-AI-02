import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown, FaUser, FaBriefcase, FaClipboardList } from "react-icons/fa";

const UserPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error("Error fetching profile:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-400">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-800 relative bg-gray-800">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          NextHire
        </h1>

        {/* Profile Icon */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <FaUserCircle size={40} className="text-gray-200 hover:text-gray-400" />
            <FaChevronDown className={`text-gray-400 transition-transform ${openProfile ? "rotate-180" : ""}`} />
          </button>

          {/* Profile Dropdown */}
          {openProfile && (
            <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Profile</h2>
                <button
                  onClick={() => setOpenProfile(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 text-gray-300">
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                {/* <p><strong>Qualification:</strong> {user.qualification}</p> */}
                <p><strong>Experience:</strong> {user.experience}</p>
                {/* <p><strong>Skills:</strong> {user.skills?.join(", ")}</p> */}
                <p>
                  <strong>Portfolio:</strong>{" "}
                  <a href={user.portfolio} target="_blank" className="text-blue-400 hover:underline">
                    {user.portfolio}
                  </a>
                </p>
                {/* <p><strong>About:</strong> {user.about}</p> */}
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 transition text-white font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Welcome, {user.fullName}</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Manage your profile, view job opportunities, or track your applications.
          </p>
        </section>

        {/* 3 Main Options */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Manage Profile */}
          <div className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition shadow-lg cursor-pointer">
            <div className="flex items-center justify-center mb-4">
              <FaUser size={32} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Manage Profile</h3>
            <p className="text-gray-400 text-center">Update personal information, resume, and portfolio</p>
          </div>

          {/* View Jobs */}
          <div className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition shadow-lg cursor-pointer">
            <div className="flex items-center justify-center mb-4">
              <FaBriefcase size={32} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">View Jobs</h3>
            <p className="text-gray-400 text-center">Browse job opportunities matching your skills</p>
          </div>

          {/* Track Applications */}
          <div className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition shadow-lg cursor-pointer">
            <div className="flex items-center justify-center mb-4">
              <FaClipboardList size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Track Applications</h3>
            <p className="text-gray-400 text-center">Check the status of your job applications</p>
          </div>
        </section>

        {/* About You Section */}
        <section className="mt-8 bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">About You</h3>
          <p className="text-gray-300 mb-2">{user.about}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 mt-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Qualification:</strong> {user.qualification}</p>
            <p><strong>Portfolio:</strong> <a href={user.portfolio} target="_blank" className="text-blue-400 hover:underline">{user.portfolio}</a></p>
            <p><strong>Skills:</strong> {user.skills?.join(", ")}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserPage;
