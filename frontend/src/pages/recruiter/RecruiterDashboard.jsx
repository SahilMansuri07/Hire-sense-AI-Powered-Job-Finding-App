import { useNavigate } from 'react-router';
import { 
  Users, Clock, Award, Plus, TrendingUp, MapPin, 
  Briefcase, Calendar, ChevronRight, FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function RecruiterDashboard() {
  const navigate = useNavigate();

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

  const upcomingInterviews = [
    { name: 'Sarah Chen', role: 'Senior Frontend Dev', time: '10:00 AM Today', color: '#1f7af9' },
    { name: 'Michael Brown', role: 'Full Stack Eng', time: '2:30 PM Today', color: '#bc13fe' },
    { name: 'Emily Davis', role: 'React Developer', time: '11:00 AM Tomorrow', color: '#10b981' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6">
      
      {/* Main Column */}
      <div className="flex-1 space-y-6">
        
        {/* Stats Cards (6 Cards Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Applications (New) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-white/20 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                <FileText className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Applications</p>
                <p className="text-2xl font-bold">1,436</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/10 w-fit px-2.5 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+24% this week</span>
            </div>
          </div>

          {/* Total Applicants (Existing) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#1f7af9]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1f7af9]/20 transition-colors">
                <Users className="w-6 h-6 text-[#1f7af9]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Applicants</p>
                <p className="text-2xl font-bold">1,284</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/10 w-fit px-2.5 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">+18% this month</span>
            </div>
          </div>

          {/* Avg. Hire Time (Existing) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#bc13fe]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#bc13fe]/10 rounded-xl flex items-center justify-center group-hover:bg-[#bc13fe]/20 transition-colors">
                <Clock className="w-6 h-6 text-[#bc13fe]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Avg. Hire Time</p>
                <p className="text-2xl font-bold">18<span className="text-lg text-gray-500 font-medium ml-1">days</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/10 w-fit px-2.5 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">-12% faster</span>
            </div>
          </div>

          {/* AI Match Score (Existing) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#10b981]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                <Award className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">AI Match Score</p>
                <p className="text-2xl font-bold">92<span className="text-lg text-gray-500 font-medium">/100</span></p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Average candidate quality</p>
          </div>

          {/* Open Positions (Existing) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#f59e0b]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                <MapPin className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Open Positions</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Across 8 departments</p>
          </div>

          {/* My Jobs (New) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#3b82f6]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                <Briefcase className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">My Jobs</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Active postings you manage</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hiring Pipeline */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold mb-6">Hiring Pipeline</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="stage" stroke="#8b92a8" axisLine={false} tickLine={false} />
                  <YAxis stroke="#8b92a8" axisLine={false} tickLine={false} />
                  <Bar dataKey="count" fill="#1f7af9" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Sources */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl flex flex-col">
            <h3 className="text-xl font-bold mb-6">Application Sources</h3>
            <div className="flex-1 min-h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={sourceData} 
                    cx="50%" cy="50%" 
                    innerRadius={65} 
                    outerRadius={100} 
                    dataKey="value" 
                    stroke="none"
                    label={entry => `${entry.name} ${entry.value}%`}
                  >
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
            <h3 className="text-xl font-bold">Top Ranked Candidates</h3>
            <button onClick={() => navigate('/recruiter/pipeline')} className="text-sm font-medium text-[#1f7af9] hover:text-[#bc13fe] transition-colors flex items-center">
              View All Pipeline <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {topCandidates.map((candidate, idx) => (
              <div key={idx} onClick={() => navigate('/recruiter/candidate/1')} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#1f7af9]/30 hover:bg-white/10 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {candidate.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#1f7af9] transition-colors">{candidate.name}</h4>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded text-black text-[10px] font-black uppercase tracking-wider">
                          New Match
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{candidate.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 mt-2 sm:mt-0">
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#10b981] leading-none mb-1">{candidate.score}</div>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">AI Match</p>
                  </div>
                  <button className="px-5 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 font-medium text-sm transition-colors border border-white/5">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Panel (Calendar & Upcoming) */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        
        {/* Upcoming Interviews Panel */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1f7af9]" /> 
              Schedule
            </h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mini Calendar Visual Placeholder */}
          <div className="bg-[#0f1723]/50 rounded-xl p-4 mb-6 border border-white/5">
             <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-semibold">July 2026</span>
               <div className="flex gap-2">
                 <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-xs cursor-pointer hover:bg-white/10">&lt;</div>
                 <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-xs cursor-pointer hover:bg-white/10">&gt;</div>
               </div>
             </div>
             <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500 font-medium">
               <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
             </div>
             <div className="grid grid-cols-7 gap-1 text-center text-xs">
               <div className="p-1 text-gray-600">28</div><div className="p-1 text-gray-600">29</div><div className="p-1 text-gray-600">30</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">1</div>
               <div className="p-1 cursor-pointer bg-[#1f7af9] text-white rounded font-bold shadow-lg shadow-[#1f7af9]/40">2</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">3</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">4</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">5</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">6</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded relative">7<div className="w-1 h-1 bg-[#bc13fe] rounded-full mx-auto mt-0.5"></div></div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">8</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded relative">9<div className="w-1 h-1 bg-[#10b981] rounded-full mx-auto mt-0.5"></div></div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">10</div>
               <div className="p-1 cursor-pointer hover:bg-white/10 rounded">11</div>
             </div>
          </div>

          <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Upcoming Interviews</h4>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {upcomingInterviews.map((interview, i) => (
              <div key={i} className="flex gap-4 relative group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full mt-1.5 ring-4 ring-[#0f1723]" style={{ backgroundColor: interview.color }} />
                  {i !== upcomingInterviews.length - 1 && (
                    <div className="w-0.5 h-full bg-white/10 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4 cursor-pointer group-hover:translate-x-1 transition-transform">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
                    <p className="font-bold text-sm text-white mb-0.5">{interview.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{interview.role}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-black/20 w-fit px-2 py-1 rounded">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {interview.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Schedule New
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
