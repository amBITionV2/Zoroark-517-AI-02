import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./landingpage";
import UserAuth from "../componets/login";
import UserPage from "./userpage";   // Import the UserPage component
import Joblist from "./joblist";
import Applications from "./applications";
import Profile from "./profile";
import AdminSignup from "../componets/adminsignup";
import AdminLoginForm from "../componets/AdminLoginForm";
import AdminSignupForm from "../componets/adminsignup";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserAuth />} />
        <Route path="/adminSignup" element={<AdminSignup />} />
        <Route path="/dashboard" element={<UserPage />} />
        <Route path="/jobs" element={<Joblist />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminLoginForm" element={<AdminLoginForm />} />
        <Route path="/adminSignupForm" element={<AdminSignupForm />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
