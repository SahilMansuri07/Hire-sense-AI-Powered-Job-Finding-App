import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { 
  Clock, Plus, TrendingUp, MapPin, 
  Briefcase, Calendar, ChevronRight, FileText, Star, Building2
} from 'lucide-react';
import { getDashboardSummary, getCandidatesPreview } from '../../redux/slices/candidatesSlice';

export function RecruiterDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardSummary, previewList, loading } = useSelector((state) => state.candidates);

  useEffect(() => {
    dispatch(getDashboardSummary());
    dispatch(getCandidatesPreview());
  }, []);

  const upcomingInterviews = [
    { name: 'Sarah Chen', role: 'Senior Frontend Dev', time: '10:00 AM Today', color: '#1f7af9' },
    { name: 'Michael Brown', role: 'Full Stack Eng', time: '2:30 PM Today', color: '#bc13fe' },
    { name: 'Emily Davis', role: 'React Developer', time: '11:00 AM Tomorrow', color: '#10b981' }
  ];

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6">
      
      {/* Main Column */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Stats Cards (4 Cards Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Applications (New) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-white/20 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                <FileText className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Applications</p>
                <p className="text-2xl font-bold">{dashboardSummary?.totalApplications || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/10 w-fit px-2.5 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{dashboardSummary?.totalApplicationsChange || '0%'}</span>
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
                <p className="text-2xl font-bold">{dashboardSummary?.avgHireTime || 0}<span className="text-lg text-gray-500 font-medium ml-1">days</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#10b981] bg-[#10b981]/10 w-fit px-2.5 py-1 rounded-md">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{dashboardSummary?.avgHireTimeChange || '0%'}</span>
            </div>
          </div>

          {/* Open Positions (Existing) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#f59e0b]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                <MapPin className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Open Positions</p>
                <p className="text-2xl font-bold">{dashboardSummary?.openPositions || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Across {dashboardSummary?.departmentCount || 0} departments</p>
          </div>

          {/* My Jobs (New) */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#3b82f6]/40 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3b82f6]/20 transition-colors">
                <Briefcase className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">My Jobs</p>
                <p className="text-2xl font-bold">{dashboardSummary?.myJobs || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Active postings you manage</p>
          </div>
        </div>

        {/* Candidates */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Applications</h3>
            <button onClick={() => navigate('/recruiter/applications')} className="text-sm font-medium text-[#1f7af9] hover:text-[#bc13fe] transition-colors flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {previewList?.length === 0 && !loading && <p className="text-gray-400">No recent applications found.</p>}
            {previewList?.map((candidate, idx) => (
              <div key={candidate.id || idx} onClick={() => navigate(`/recruiter/application/${candidate.id}`)} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#1f7af9]/30 hover:bg-white/10 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                    {candidate.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white group-hover:text-[#1f7af9] transition-colors">{candidate.name}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-white rounded uppercase tracking-wider">
                        {candidate.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {candidate.role}</span>
                      {candidate.department && candidate.department !== 'N/A' && (
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {candidate.department}</span>
                      )}
                      {candidate.location && candidate.location !== 'N/A' && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {candidate.location}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 mt-2 sm:mt-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
                    <Star className="w-4 h-4 text-[#10b981] fill-current" />
                    <span className="text-[#10b981] font-bold">{candidate.matchScore || 0}% Match</span>
                  </div>
                  <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 font-medium text-sm transition-colors border border-white/5 shrink-0">
                    View
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
