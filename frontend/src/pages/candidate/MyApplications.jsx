import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getAppliedJobsAPI, getApplicationStatusAPI } from '../../api/api';
import { ArrowLeft, Building2, MapPin, Briefcase, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function MyApplications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [selectedApp, setSelectedApp] = useState(null);

  const [statusCounts, setStatusCounts] = useState({
    totalApplications: 0,
    appliedCount: 0,
    shortlistedCount: 0,
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
          shortlistedCount: statusRes.data.shortlistedCount || 0,
          rejectedCount: statusRes.data.rejectedCount || 0
        });
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    setSearchParams(params, { replace: true });
  }, [statusFilter, setSearchParams]);

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return app.status === 'pending' || app.status === 'applied';
    return app.status === statusFilter;
  });

  if (loading) return <div className="min-h-screen bg-[#0f1723] text-white flex justify-center items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-gray-400">Track and manage your job applications</p>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] text-sm cursor-pointer transition-colors"
            >
              <option value="all" className="bg-[#0f1723]">All Statuses</option>
              <option value="pending" className="bg-[#0f1723]">Pending</option>
              <option value="shortlisted" className="bg-[#0f1723]">Shortlisted</option>
              <option value="rejected" className="bg-[#0f1723]">Rejected</option>
            </select>
          </div>
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
            <p className="text-4xl font-bold text-[#10b981] mb-2">{statusCounts.shortlistedCount}</p>
            <p className="text-sm text-gray-400">Shortlisted</p>
          </div>
          <div className="p-6 bg-white/5 backdrop-blur border border-[#ef4444]/30 rounded-2xl text-center">
            <p className="text-4xl font-bold text-[#ef4444] mb-2">{statusCounts.rejectedCount}</p>
            <p className="text-sm text-gray-400">Rejected</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 mb-4">No applications found matching your filters.</p>
              <button onClick={() => navigate('/candidate/jobs')} className="px-6 py-3 bg-[#1f7af9] rounded-xl font-semibold hover:bg-[#1f7af9]/80 transition-colors">
                Browse Jobs
              </button>
            </div>
          ) : (
            filteredApplications.map((app, idx) => (
              <div 
                key={app.applicationId || idx} 
                onClick={() => setSelectedApp(app)}
                className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/30 hover:bg-white/10 transition-all cursor-pointer group"
              >
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
                      ${app.status === 'shortlisted' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50' : 
                        app.status === 'rejected' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/50' : 
                        'bg-[#1f7af9]/20 text-[#1f7af9] border border-[#1f7af9]/50'}`}>
                      {app.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f1723] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0f1723]/95 backdrop-blur">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button onClick={() => setSelectedApp(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
              <div className="p-6 space-y-8">
                {/* Header Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                    <Building2 className="w-8 h-8 text-[#1f7af9]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{selectedApp.jobTitle}</h3>
                    <p className="text-lg text-gray-400 mb-3">{selectedApp.companyName}</p>
                    <span className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize border
                      ${selectedApp.status === 'shortlisted' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 
                        selectedApp.status === 'rejected' ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30' : 
                        'bg-[#1f7af9]/10 text-[#1f7af9] border-[#1f7af9]/30'}`}>
                      {selectedApp.status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                {/* Job Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-sm">{selectedApp.location || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Employment Type</p>
                    <p className="font-semibold text-sm">{selectedApp.employmentType || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Applied On</p>
                    <p className="font-semibold text-sm">{selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-lg font-bold mb-4">Application Timeline</h4>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/10">
                    
                    {(!selectedApp.statusHistory || selectedApp.statusHistory.length === 0) ? (
                      /* Fallback static timeline if no history exists */
                      <>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f1723] bg-[#10b981] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold">Applied</h4>
                              <span className="text-xs text-gray-400">{selectedApp.timeAgo}</span>
                            </div>
                            <p className="text-sm text-gray-400">Application successfully submitted.</p>
                          </div>
                        </div>
                        {selectedApp.status === 'shortlisted' && (
                          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f1723] bg-[#10b981] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-[#10b981]">Shortlisted</h4>
                              </div>
                              <p className="text-sm text-gray-400">Congratulations! You have been shortlisted for this role.</p>
                            </div>
                          </div>
                        )}
                        {selectedApp.status === 'rejected' && (
                          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f1723] bg-[#ef4444] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-[#ef4444]">Rejected</h4>
                              </div>
                              <p className="text-sm text-gray-400">Unfortunately, the company decided not to move forward.</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Dynamic timeline based on statusHistory */
                      selectedApp.statusHistory.map((historyItem, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0f1723] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                            historyItem.status === 'rejected' ? 'bg-[#ef4444]' : 'bg-[#10b981]'
                          }`}>
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-bold capitalize ${
                                historyItem.status === 'rejected' ? 'text-[#ef4444]' : historyItem.status === 'shortlisted' ? 'text-[#10b981]' : 'text-white'
                              }`}>{historyItem.status}</h4>
                              <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(historyItem.updatedAt), { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-gray-400">
                              {historyItem.status === 'pending' ? 'Application successfully submitted.' : 
                               historyItem.status === 'shortlisted' ? 'Congratulations! You have been shortlisted for this role.' : 
                               'Unfortunately, the company decided not to move forward.'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
