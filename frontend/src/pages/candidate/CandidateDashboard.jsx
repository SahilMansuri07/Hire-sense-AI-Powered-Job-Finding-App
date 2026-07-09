import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Target, TrendingUp, Award, Search, FileText, Brain, Video, Bell, User, Settings, X, Upload, LogOut } from 'lucide-react';
import { RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { getUserDashboardAPI, getResumeScoreAPI } from '../../api/api';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { ATSResultDetails } from './ATSResultDetails';
import { authStorage } from '../../utils/authStorage';

export function CandidateDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const [atsScore, setAtsScore] = useState(0);  
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    Promise.all([
      getUserDashboardAPI().catch(err => ({ data: null })),
      getResumeScoreAPI().catch(err => ({ data: null }))
    ]).then(([dashboardRes, scoreRes]) => {
      if (dashboardRes?.data) setData(dashboardRes.data);
      
      let localData = {};
      try {
        const stored = authStorage.getResumeAnalysis(user?._id || 'unknown');
        console.log("stored", stored)
        if (stored) {
          localData = stored;
        }
      } catch(e) {}

      if (Object.keys(localData).length > 0) {
        const jdMatchStr = localData["JD Match"] || localData["jd_match"] || localData["ats_score"] || "0";
        const parsedScore = typeof jdMatchStr === 'number' ? jdMatchStr : parseInt(String(jdMatchStr).replace('%', ''), 10) || 0;
        setAtsScore(parsedScore);
        setParsedData(localData);
      } else if (scoreRes?.data) {
        setAtsScore(scoreRes.data.stats?.atsScore || 0);
        setParsedData(scoreRes.data.resumeInsights || {});
      }
    }).finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div className="min-h-screen bg-[#0f1723] text-white flex items-center justify-center">Loading...</div>;

  const {
    UserName = 'User',
    totalAppliedJobs = 0,
    pending = 0,
    accepted = 0,
    rejected = 0,
    recentAppliedJobs = []
  } = data || {};

  const atsData = [{ name: 'ATS', value: Number(atsScore) || 0, fill: '#1f7af9' }];

  const progressData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 85 },
  ];

  return <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#0f1723]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>HireSense AI</h1>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/candidate/dashboard')} className="text-[#1f7af9] font-semibold">Dashboard</button>
              <button onClick={() => navigate('/candidate/jobs')} className="text-gray-400 hover:text-white transition-colors">Jobs</button>
              <button onClick={() => navigate('/candidate/my-applications')} className="text-gray-400 hover:text-white transition-colors">My Applications</button>
              <button onClick={() => navigate('/candidate/ats-analyzer')} className="text-gray-400 hover:text-white transition-colors">ATS Analyzer</button>
              <button onClick={() => navigate('/candidate/interview-setup')} className="text-gray-400 hover:text-white transition-colors">Mock Interview</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/notifications')} className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>
            <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/candidate/profile')} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0) || user?.first_name?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:block font-medium">{user?.name || user?.first_name || 'Profile'}</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="hidden md:block">Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {UserName}!</h2>
          <p className="text-gray-400">Here's your career progress overview. Total Applications: {totalAppliedJobs}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-400 mb-1">Total Applied</p>
            <p className="text-4xl font-bold text-[#1f7af9]">{totalAppliedJobs}</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#f59e0b]/50 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-400 mb-1">Pending</p>
            <p className="text-4xl font-bold text-[#f59e0b]">{pending}</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#10b981]/50 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-400 mb-1">Accepted</p>
            <p className="text-4xl font-bold text-[#10b981]">{accepted}</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#ef4444]/50 hover:shadow-lg transition-all">
            <p className="text-sm text-gray-400 mb-1">Rejected</p>
            <p className="text-4xl font-bold text-[#ef4444]">{rejected}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => navigate('/candidate/jobs')} className="p-6 bg-gradient-to-br from-[#1f7af9]/20 to-[#1f7af9]/5 border border-[#1f7af9]/30 rounded-2xl hover:border-[#1f7af9] hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all group">
            <Search className="w-8 h-8 text-[#1f7af9] mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold">Search Jobs</p>
          </button>

          <button onClick={() => navigate('/candidate/ats-analyzer')} className="p-6 bg-gradient-to-br from-[#bc13fe]/20 to-[#bc13fe]/5 border border-[#bc13fe]/30 rounded-2xl hover:border-[#bc13fe] hover:shadow-lg hover:shadow-[#bc13fe]/30 transition-all group">
            <FileText className="w-8 h-8 text-[#bc13fe] mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold">ATS Analyzer</p>
          </button>

          <button onClick={() => navigate('/candidate/skill-gap')} className="p-6 bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/30 rounded-2xl hover:border-[#10b981] hover:shadow-lg hover:shadow-[#10b981]/30 transition-all group">
            <Brain className="w-8 h-8 text-[#10b981] mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold">Skill Gap</p>
          </button>

          <button onClick={() => navigate('/candidate/interview-prep')} className="p-6 bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/30 rounded-2xl hover:border-[#f59e0b] hover:shadow-lg hover:shadow-[#f59e0b]/30 transition-all group">
            <Video className="w-8 h-8 text-[#f59e0b] mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold">Interview Prep</p>
          </button>
        </div>

        {/* Applied Jobs & Application Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Jobs Applied</h3>
              <button onClick={() => navigate('/candidate/my-applications')} className="text-sm text-[#1f7af9] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentAppliedJobs.length === 0 && <p className="text-gray-400">No jobs applied yet.</p>}
              {recentAppliedJobs.slice(0, 3).map((job, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{job.companyName}</p>
                      <p className="text-sm text-gray-400">{job.jobTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        (job.status || '').toLowerCase() === 'accepted' ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]' :
                        (job.status || '').toLowerCase() === 'rejected' ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]' :
                        'bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]'
                      }`}>
                        {job.status || 'applied'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{job.timeAgo || job.appliedAt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Application Status Tracker</h3>
            <div className="relative">
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-white/10" />
              <div className="space-y-6">
                {[{
                stage: 'Application Submitted',
                date: 'Apr 20, 2026',
                status: 'completed'
              }, {
                stage: 'Resume Screening',
                date: 'Apr 21, 2026',
                status: 'completed'
              }, {
                stage: 'Aptitude Test',
                date: 'Apr 22, 2026',
                status: 'active'
              }, {
                stage: 'Technical Interview',
                date: 'Pending',
                status: 'pending'
              }, {
                stage: 'HR Round',
                date: 'Pending',
                status: 'pending'
              }].map((step, idx) => <div key={idx} className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.status === 'completed' ? 'bg-[#10b981] border-2 border-[#10b981]' : step.status === 'active' ? 'bg-[#1f7af9] border-2 border-[#1f7af9] animate-pulse' : 'bg-white/10 border-2 border-white/20'}`}>
                      {step.status === 'completed' && <span className="text-white text-sm">✓</span>}
                      {step.status === 'active' && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className={`font-semibold ${step.status === 'active' ? 'text-[#1f7af9]' : ''}`}>
                        {step.stage}
                      </p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Career Progress Chart & Recent Interviews */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Career Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <XAxis dataKey="month" stroke="#8b92a8" />
                <YAxis stroke="#8b92a8" />
                <Line type="monotone" dataKey="score" stroke="#1f7af9" strokeWidth={3} dot={{
                fill: '#1f7af9',
                r: 5
              }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">ATS Resume Score</h3>
                <p className="text-sm text-gray-400">Based on your latest upload</p>
              </div>
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={atsData} startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%">
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-5xl font-bold mb-2">{atsData[0].value}<span className="text-2xl text-gray-400">/100</span></p>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>Ready for applications</span>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button onClick={() => setShowAnalysisModal(true)} className="w-full py-2 bg-[#1f7af9]/20 text-[#1f7af9] hover:bg-[#1f7af9]/30 rounded-lg font-semibold transition-colors">
                View Analysis Details
              </button>
              <button onClick={() => navigate('/candidate/ats-analyzer')} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">
                Analyze New Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Details Modal */}
      {showAnalysisModal && (
        <ATSResultDetails 
          parsedData={parsedData} 
          onClose={() => setShowAnalysisModal(false)} 
        />
      )}
    </div>;
}
