import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Target, TrendingUp, Award, Search, FileText, Brain, Video, Bell, User, Settings } from 'lucide-react';
import { RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { getUserDashboardAPI } from '../../api/api';

export function CandidateDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDashboardAPI().then(res => {
      setData(res.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="min-h-screen bg-[#0f1723] text-white flex items-center justify-center">Loading...</div>;

  const atsData = [{ name: 'ATS', value: Number(data?.stats?.atsScore) || 0, fill: '#1f7af9' }];
  const confidenceData = [{ name: 'Confidence', value: Number(data?.stats?.experienceMatch) || 0, fill: '#bc13fe' }];
  const alignmentData = [{ name: 'Alignment', value: Number(data?.stats?.skillAlignment) || 0, fill: '#10b981' }];
  const appliedJobs = data?.appliedJobs || [];
  const summary = data?.summary || { totalApplications: 0, acceptedCount: 0 };
  const userProfile = data?.userProfile || {};

  const progressData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 85 },
  ];

  const recentInterviews = [
    { company: 'TechCorp', role: 'Frontend Dev', score: 88, date: 'Apr 15, 2026' },
    { company: 'StartupXYZ', role: 'React Engineer', score: 92, date: 'Apr 10, 2026' },
  ];

  return <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#0f1723]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">HireSense AI</h1>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/candidate/dashboard')} className="text-[#1f7af9] font-semibold">Dashboard</button>
              <button onClick={() => navigate('/candidate/jobs')} className="text-gray-400 hover:text-white transition-colors">Jobs</button>
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
              <User className="w-5 h-5" />
              <span className="hidden md:block">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name || 'User'}!</h2>
          <p className="text-gray-400">Here's your career progress overview. Total Applications: {summary.totalApplications}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">ATS Score</p>
                <p className="text-4xl font-bold">{atsData[0].value}<span className="text-xl text-gray-400">/100</span></p>
              </div>
              <div className="w-20 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={atsData} startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%">
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>+8% from last week</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#bc13fe]/50 hover:shadow-lg hover:shadow-[#bc13fe]/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Experience Match</p>
                <p className="text-4xl font-bold">{confidenceData[0].value}<span className="text-xl text-gray-400">%</span></p>
              </div>
              <div className="w-20 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={confidenceData} startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%">
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>+12% improvement</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#10b981]/50 hover:shadow-lg hover:shadow-[#10b981]/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Skill Alignment</p>
                <p className="text-4xl font-bold">{alignmentData[0].value}<span className="text-xl text-gray-400">%</span></p>
              </div>
              <div className="w-20 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={alignmentData} startAngle={90} endAngle={-270} innerRadius="70%" outerRadius="100%">
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <Award className="w-4 h-4" />
              <span>Excellent match</span>
            </div>
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
            <h3 className="text-xl font-bold mb-6">Applied Jobs</h3>
            <div className="space-y-4">
              {appliedJobs.length === 0 && <p className="text-gray-400">No jobs applied yet.</p>}
              {appliedJobs.slice(0, 3).map((job, idx) => <div key={idx} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{job.jobTitle || 'Unknown'}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 border border-white/20 text-gray-400">
                      {job.status}
                    </span>
                  </div>
                </div>)}
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

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Recent Interviews</h3>
            <div className="space-y-4">
              {recentInterviews.map((interview, idx) => <div key={idx} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{interview.company}</p>
                      <p className="text-sm text-gray-400">{interview.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1f7af9]">{interview.score}</p>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{interview.date}</p>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
}
