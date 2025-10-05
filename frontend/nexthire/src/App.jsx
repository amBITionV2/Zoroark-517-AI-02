import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./landingpage";
import UserAuth from "../componets/login";
import UserPage from "./userpage";   // Import the UserPage component
import Joblist from "./joblist";
import JobApplicationRules from "./jobapplicationrules";
import InterviewPage from "./interviewpage";
import MCQQuiz from "./mcqquiz.jsx";
import AIInterviewDashboard from "./aiinterview"; // Import the AI Interview Dashboard
import Applications from "./applications";
import Profile from "./profile";
import AdminSignupForm from "../componets/AdminSignupForm.jsx";
import AdminLoginForm from "../componets/AdminLoginForm";
import Dashboard from "./admin/adminDashboard.jsx";
import CandidateDetail from "./admin/candidateDetails.jsx";
import CreateJob from "./admin/createJobs.jsx";
import JobApplicants from "./admin/jobApplicants.jsx";
import ApplicantDetail from "./admin/applicantDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserAuth />} />
        <Route path="/adminSignup" element={<AdminSignupForm />} />
        <Route path="/adminLoginForm" element={<AdminLoginForm />} />
        <Route path="/dashboard" element={<UserPage />} />
        <Route path="/jobs" element={<Joblist />} />
        <Route path="/jobs/rules" element={<JobApplicationRules />} />
        <Route path="/jobs/interview" element={<InterviewPage />} />
        <Route path="/jobs/mcq" element={<MCQQuiz />} />
        <Route path="/jobs/ai-interview" element={<AIInterviewDashboard />} /> {/* Add AI Interview route */}
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminLoginForm" element={<AdminLoginForm />} />
        <Route path="/adminSignupForm" element={<AdminSignupForm />} />
        <Route path="/adminDashboard" element={<Dashboard />} />
        <Route path="/adminCandidate/:id" element={<CandidateDetail />} />
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/admin/job/:jobId/applicants" element={<JobApplicants />} />
        <Route path="/admin/applicant/:jobId/:userId" element={<ApplicantDetail />} />
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