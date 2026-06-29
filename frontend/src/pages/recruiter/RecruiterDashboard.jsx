import { useNavigate } from 'react-router';
import { Users, Clock, Award, Plus, Search, Bell, Settings, User, TrendingUp, MapPin, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
export function RecruiterDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  const pipelineData = [{
    stage: 'Applied',
    count: 342
  }, {
    stage: 'Screening',
    count: 156
  }, {
    stage: 'Interview',
    count: 68
  }, {
    stage: 'Offer',
    count: 24
  }, {
    stage: 'Hired',
    count: 12
  }];
  const sourceData = [{
    name: 'LinkedIn',
    value: 45,
    color: '#1f7af9'
  }, {
    name: 'Indeed',
    value: 30,
    color: '#bc13fe'
  }, {
    name: 'Referral',
    value: 15,
    color: '#10b981'
  }, {
    name: 'Direct',
    value: 10,
    color: '#f59e0b'
  }];
  const topCandidates = [{
    name: 'Sarah Chen',
    role: 'Senior Frontend Dev',
    score: 96,
    avatar: '👩'
  }, {
    name: 'Michael Brown',
    role: 'Full Stack Engineer',
    score: 94,
    avatar: '👨'
  }, {
    name: 'Emily Davis',
    role: 'React Developer',
    score: 91,
    avatar: '👩'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-[#0f1723]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">HireSense AI</h1>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/recruiter/dashboard')} className="text-[#1f7af9] font-semibold">Dashboard</button>
              <button onClick={() => navigate('/recruiter/pipeline')} className="text-gray-400 hover:text-white transition-colors">Pipeline</button>
              <button onClick={() => navigate('/recruiter/post-job')} className="text-gray-400 hover:text-white transition-colors">Post Job</button>
              <button onClick={() => navigate('/analytics')} className="text-gray-400 hover:text-white transition-colors">Analytics</button>
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
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
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
        {/* Welcome & Quick Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name || user?.first_name || 'Recruiter'}!</h2>
            <p className="text-gray-400">Manage your hiring pipeline and track performance</p>
          </div>
          <button onClick={() => navigate('/recruiter/post-job')} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1f7af9]/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#1f7af9]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Applicants</p>
                <p className="text-3xl font-bold">1,284</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>+18% this month</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#bc13fe]/50 hover:shadow-lg hover:shadow-[#bc13fe]/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#bc13fe]/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#bc13fe]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg. Hire Time</p>
                <p className="text-3xl font-bold">18<span className="text-lg text-gray-400">d</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>-12% faster</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#10b981]/50 hover:shadow-lg hover:shadow-[#10b981]/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">AI Match Score</p>
                <p className="text-3xl font-bold">92<span className="text-lg text-gray-400">/100</span></p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Average quality</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#f59e0b]/50 hover:shadow-lg hover:shadow-[#f59e0b]/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#f59e0b]/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Open Positions</p>
                <p className="text-3xl font-bold">24</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Across 8 departments</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Hiring Pipeline */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Hiring Pipeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipelineData}>
                <XAxis dataKey="stage" stroke="#8b92a8" />
                <YAxis stroke="#8b92a8" />
                <Bar dataKey="count" fill="#1f7af9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Application Sources */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Application Sources</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={entry => `${entry.name} ${entry.value}%`}>
                    {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Ranked Candidates */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Top Ranked Candidates</h3>
            <button onClick={() => navigate('/recruiter/pipeline')} className="text-[#1f7af9] hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topCandidates.map((candidate, idx) => <div key={idx} onClick={() => navigate('/recruiter/candidate/1')} className="p-5 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-xl flex items-center justify-center text-3xl">
                    {candidate.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-semibold">{candidate.name}</h4>
                      {idx === 0 && <span className="px-2 py-1 bg-[#f59e0b]/20 border border-[#f59e0b] rounded text-[#f59e0b] text-xs">
                          NEW
                        </span>}
                    </div>
                    <p className="text-gray-400">{candidate.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#10b981]">{candidate.score}</div>
                    <p className="text-xs text-gray-500">AI Match</p>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                    View Profile
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
