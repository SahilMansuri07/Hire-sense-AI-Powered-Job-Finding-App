import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAppliedJobsAPI, getApplicationStatusAPI } from '../../api/api';
import { ArrowLeft, Building2, MapPin, Briefcase, Clock } from 'lucide-react';

export function MyApplications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    totalApplications: 0,
    appliedCount: 0,
    acceptedCount: 0,
    rejectedCount: 0
  });

  useEffect(() => {
    Promise.all([
      getAppliedJobsAPI().catch(err => ({ data: [] })),
      getApplicationStatusAPI().catch(err => ({ data: {} }))
    ]).then(([jobsRes, statusRes]) => {
      setApplications(jobsRes?.data || []);
      if (statusRes?.data) {
        setStatusCounts({
          totalApplications: statusRes.data.totalApplications || 0,
          appliedCount: statusRes.data.appliedCount || 0,
          acceptedCount: statusRes.data.acceptedCount || 0,
          rejectedCount: statusRes.data.rejectedCount || 0
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0f1723] text-white flex justify-center items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Applications</h1>
          <p className="text-gray-400">Track and manage your job applications</p>
        </div>

        {/* Summary Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl text-center">
            <p className="text-4xl font-bold text-white mb-2">{statusCounts.totalApplications}</p>
            <p className="text-sm text-gray-400">Total Applied</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-[#1f7af9]/30 rounded-2xl text-center">
            <p className="text-4xl font-bold text-[#1f7af9] mb-2">{statusCounts.appliedCount}</p>
            <p className="text-sm text-gray-400">In Review</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-[#10b981]/30 rounded-2xl text-center">
            <p className="text-4xl font-bold text-[#10b981] mb-2">{statusCounts.acceptedCount}</p>
            <p className="text-sm text-gray-400">Accepted</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-[#ef4444]/30 rounded-2xl text-center">
            <p className="text-4xl font-bold text-[#ef4444] mb-2">{statusCounts.rejectedCount}</p>
            <p className="text-sm text-gray-400">Rejected</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
              <button onClick={() => navigate('/candidate/jobs')} className="px-6 py-3 bg-[#1f7af9] rounded-xl font-semibold hover:bg-[#1f7af9]/80 transition-colors">
                Browse Jobs
              </button>
            </div>
          ) : (
            applications.map((app, idx) => (
              <div key={app.applicationId || idx} className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      <Building2 className="w-6 h-6 text-[#1f7af9]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{app.jobTitle || 'Unknown Role'}</h3>
                      <p className="text-gray-400 mb-2">{app.companyName || 'Company'}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        {app.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.location}
                          </div>
                        )}
                        {app.employmentType && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {app.employmentType}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Applied {app.timeAgo || 'recently'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 self-start md:self-center">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize
                      ${app.status === 'accepted' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50' : 
                        app.status === 'rejected' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50' : 
                        'bg-[#1f7af9]/20 text-[#1f7af9] border border-[#1f7af9]/50'}`}>
                      {app.status || 'Applied'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
