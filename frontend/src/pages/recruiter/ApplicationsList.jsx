import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, MapPin, Briefcase, Star, Building2, ChevronRight, User } from 'lucide-react';
import { fetchCandidatesAPI } from '../../api/recruiterJobsApi';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';

export function ApplicationsList() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const res = await fetchCandidatesAPI(page, 10, { search, status: statusFilter, sort: sortOrder });
        if (res?.data) {
          setCandidates(res.data.candidates || []);
          setTotalPages(res.data.pagination?.totalPages || 1);
          setTotal(res.data.pagination?.total || 0);
        }
      } catch (err) {
        setError("Failed to fetch candidates.");
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      loadCandidates();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, search, statusFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Applications</h1>
            <p className="text-gray-400">Review and manage your job applicants.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={search}
                onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm w-64 transition-colors" 
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {setStatusFilter(e.target.value); setPage(1);}}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm cursor-pointer transition-colors"
            >
              <option value="all" className="bg-[#0f1723]">All Status</option>
              <option value="pending" className="bg-[#0f1723]">Pending</option>
              <option value="shortlisted" className="bg-[#0f1723]">Shortlisted</option>
              <option value="rejected" className="bg-[#0f1723]">Rejected</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => {setSortOrder(e.target.value); setPage(1);}}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm cursor-pointer transition-colors"
            >
              <option value="desc" className="bg-[#0f1723]">Newest First</option>
              <option value="asc" className="bg-[#0f1723]">Oldest First</option>
            </select>
          </div>
        </div>

        {error && <div className="p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-500 rounded-xl">{error}</div>}

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Total Candidates ({total})</h3>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                 <div className="text-center py-10 text-gray-400">Loading candidates...</div>
              ) : candidates.length === 0 ? (
                 <div className="text-center py-10 text-gray-400">No applications found.</div>
              ) : (
                candidates.map((candidate) => (
                  <div key={candidate.id} onClick={() => navigate(`/recruiter/application/${candidate.id}`)} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#1f7af9]/30 hover:bg-white/10 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-4">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                        {candidate.avatar || <User className="w-6 h-6 text-[#1f7af9]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-[#1f7af9] transition-colors">{candidate.name}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${candidate.status === 'shortlisted' ? 'bg-[#10b981]/20 text-[#10b981]' : candidate.status === 'rejected' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-white/10 text-white'}`}>
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
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 mt-2 md:mt-0">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
                        <Star className="w-4 h-4 text-[#10b981] fill-current" />
                        <span className="text-[#10b981] font-bold">{candidate.matchScore || 0}% Match</span>
                      </div>
                      <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 font-medium text-sm transition-colors border border-white/5 shrink-0 flex items-center gap-1">
                        View Profile <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination className="mb-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(p => p - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-white/10"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className={`cursor-pointer ${page === idx + 1 ? "bg-[#1f7af9] text-white border-none" : "hover:bg-white/10 text-gray-300"}`}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(p => p + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-white/10"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

      </div>
    </div>
  );
}
