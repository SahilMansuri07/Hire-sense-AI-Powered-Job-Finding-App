import { lazy, Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from "react-router";
import Loader from "../components/ui/Loader";

const LandingPage = lazy(() => import("../pages/common/LandingPage").then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import("../pages/auth/Login").then(m => ({ default: m.Login })));
const Register = lazy(() => import("../pages/auth/Register").then(m => ({ default: m.Register })));
const RoleSelection = lazy(() => import("../pages/auth/RoleSelection").then(m => ({ default: m.RoleSelection })));
const OnboardingFlow = lazy(() => import("../pages/auth/OnboardingFlow").then(m => ({ default: m.OnboardingFlow })));

const CandidateDashboard = lazy(() => import("../pages/candidate/CandidateDashboard").then(m => ({ default: m.CandidateDashboard })));
const JobSearch = lazy(() => import("../pages/candidate/JobSearch").then(m => ({ default: m.JobSearch })));
const JobDetail = lazy(() => import("../pages/candidate/JobDetail").then(m => ({ default: m.JobDetail })));
const ATSAnalyzer = lazy(() => import("../pages/candidate/ATSAnalyzer").then(m => ({ default: m.ATSAnalyzer })));
const SkillGapAnalysis = lazy(() => import("../pages/candidate/SkillGapAnalysis").then(m => ({ default: m.SkillGapAnalysis })));
const InterviewSetup = lazy(() => import("../pages/candidate/InterviewSetup").then(m => ({ default: m.InterviewSetup })));
const InterviewLive = lazy(() => import("../pages/candidate/InterviewLive").then(m => ({ default: m.InterviewLive })));
const InterviewResults = lazy(() => import("../pages/candidate/InterviewResults").then(m => ({ default: m.InterviewResults })));
const CandidateProfile = lazy(() => import("../pages/candidate/CandidateProfile").then(m => ({ default: m.CandidateProfile })));
const AptitudeTest = lazy(() => import("../pages/candidate/AptitudeTest").then(m => ({ default: m.AptitudeTest })));
const TechnicalTest = lazy(() => import("../pages/candidate/TechnicalTest").then(m => ({ default: m.TechnicalTest })));
const InterviewPreparation = lazy(() => import("../pages/candidate/InterviewPreparation").then(m => ({ default: m.InterviewPreparation })));
const MyApplications = lazy(() => import("../pages/candidate/MyApplications").then(m => ({ default: m.MyApplications })));
const HRInterview = lazy(() => import("../pages/candidate/HRInterview").then(m => ({ default: m.HRInterview })));

const RecruiterDashboard = lazy(() => import("../pages/recruiter/RecruiterDashboard").then(m => ({ default: m.RecruiterDashboard })));
const ApplicationDetail = lazy(() => import("../pages/recruiter/ApplicationDetail").then(m => ({ default: m.ApplicationDetail })));
const ApplicationsList = lazy(() => import("../pages/recruiter/ApplicationsList").then(m => ({ default: m.ApplicationsList })));
const JobPostingCreator = lazy(() => import("../pages/recruiter/JobPostingCreator").then(m => ({ default: m.JobPostingCreator })));
const RecruiterJobsPage = lazy(() => import("../pages/recruiter/RecruiterJobsPage").then(m => ({ default: m.RecruiterJobsPage })));
const InterviewScheduler = lazy(() => import("../pages/recruiter/InterviewScheduler").then(m => ({ default: m.InterviewScheduler })));
const TalentPipeline = lazy(() => import("../pages/recruiter/TalentPipeline").then(m => ({ default: m.TalentPipeline })));

const Analytics = lazy(() => import("../pages/common/Analytics").then(m => ({ default: m.Analytics })));
const AdminPanel = lazy(() => import("../pages/admin/AdminPanel").then(m => ({ default: m.AdminPanel })));
const Settings = lazy(() => import("../pages/common/Settings").then(m => ({ default: m.Settings })));
const Notifications = lazy(() => import("../pages/common/Notifications").then(m => ({ default: m.Notifications })));
const EmptyState = lazy(() => import("../pages/common/EmptyState").then(m => ({ default: m.EmptyState })));

import { ProtectedRoute } from "./ProtectedRoute";
import { RecruiterLayout } from "../components/layout/RecruiterLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Suspense fallback={<Loader />}><Outlet /></Suspense>}>
      {/* ── Public / Root ── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<ProtectedRoute isPublic={true}><Login /></ProtectedRoute>} />
      <Route path="/register" element={<ProtectedRoute isPublic={true}><Register /></ProtectedRoute>} />
      <Route path="/role-selection" element={<ProtectedRoute isPublic={true}><RoleSelection /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />

      {/* ── Candidate ── */}
      <Route path="/candidate" element={<ProtectedRoute role="user"><Outlet /></ProtectedRoute>}>
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="jobs" element={<JobSearch />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="ats-analyzer" element={<ATSAnalyzer />} />
        <Route path="skill-gap" element={<SkillGapAnalysis />} />
        <Route path="interview-setup" element={<InterviewSetup />} />
        <Route path="interview-live" element={<InterviewLive />} />
        <Route path="interview-results/:id" element={<InterviewResults />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="aptitude-test" element={<AptitudeTest />} />
        <Route path="technical-test" element={<TechnicalTest />} />
        <Route path="interview-prep" element={<InterviewPreparation />} />
        <Route path="hr-interview" element={<HRInterview />} />
      </Route>

      {/* ── Recruiter ── */}
      <Route path="/recruiter" element={<ProtectedRoute role="recruiter"><RecruiterLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="applications" element={<ApplicationsList />} />
        <Route path="application/:id" element={<ApplicationDetail />} />
        <Route path="jobs" element={<RecruiterJobsPage />} />
        <Route path="post-job" element={<JobPostingCreator />} />
        <Route path="edit-job/:id" element={<JobPostingCreator />} />
        <Route path="scheduler" element={<InterviewScheduler />} />
      </Route>

      {/* ── Admin ── */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />

      {/* ── Common ── */}
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/empty" element={<EmptyState />} />
    </Route>
  )
);
