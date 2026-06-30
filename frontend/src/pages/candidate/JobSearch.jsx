import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, DollarSign, Briefcase, BookmarkPlus, ArrowLeft, SlidersHorizontal, Send } from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';
import { fetchJobsThunk, setFilters, setPage } from '../../redux/slices/jobListingSlice';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../../components/ui/pagination';

export function JobSearch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { jobs, pagination, filters: reduxFilters, loading } = useSelector(state => state.jobListing);
  
  // Local state for debouncing inputs before committing to Redux filters
  const [localSearch, setLocalSearch] = useState(reduxFilters.search || '');
  const [localFilters, setLocalFilters] = useState({
    location: reduxFilters.location || '',
    salary: reduxFilters.min_salary || '',
    type: reduxFilters.employmentType || '',
    remote: reduxFilters.is_remote || false,
    experience: reduxFilters.experience_level || ''
  });

  const [applyModalState, setApplyModalState] = useState({
    isOpen: false,
    jobTitle: '',
    company: ''
  });

  // Commit local filters to Redux
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({
        search: localSearch,
        location: localFilters.location,
        employmentType: localFilters.type,
        min_salary: localFilters.salary,
        is_remote: localFilters.remote,
        experience_level: localFilters.experience
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, localFilters, dispatch]);

  // Fetch jobs when Redux filters or page changes
  useEffect(() => {
    // We only fetch if it's the first time OR if filters/page changed.
    // The thunk takes care of the API call.
    dispatch(fetchJobsThunk({
      ...reduxFilters,
      page: pagination.currentPage,
      limit: pagination.limit
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, reduxFilters, pagination.currentPage, pagination.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setPage(newPage));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/candidate/dashboard')} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2">Find Your Dream Job</h1>
          <p className="text-gray-400">AI-matched opportunities tailored for you</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)} placeholder="Search by role, company, or skill..." className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all pointer-events-none">
              Search
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={localFilters.location} onChange={e => setLocalFilters({...localFilters, location: e.target.value})} placeholder="Location" className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm" />
            </div>
            <select value={localFilters.experience} onChange={e => setLocalFilters({...localFilters, experience: e.target.value})} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm">
              <option value="">Experience</option>
              <option value="Fresher">Entry Level (0-2 years)</option>
              <option value="Junior">Junior (2-4 years)</option>
              <option value="Mid">Mid Level (4-6 years)</option>
              <option value="Senior">Senior (6-10 years)</option>
            </select>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="number" value={localFilters.salary} onChange={e => setLocalFilters({...localFilters, salary: e.target.value})} placeholder="Min Salary" className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm" />
            </div>
            <select value={localFilters.type} onChange={e => setLocalFilters({...localFilters, type: e.target.value})} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm">
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <label className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" checked={localFilters.remote} onChange={e => setLocalFilters({...localFilters, remote: e.target.checked})} className="w-4 h-4 rounded" />
              <span className="text-sm">Remote</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found <span className="text-white font-semibold">{pagination?.total || jobs.length} jobs</span> matching your profile
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-4 mb-8">
          {loading ? <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div> : jobs.length === 0 ? <div className="text-center py-10 text-gray-400">No jobs found</div> : jobs.map(job => <div key={job._id} onClick={() => navigate(`/candidate/jobs/${job._id}`)} className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  🏢
                </div>

                {/* Job Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-[#1f7af9] transition-colors">
                        {job.jobTitle}
                      </h3>
                      <p className="text-gray-400">{job.companyName || job.department || 'Company'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-lg">
                        <p className="text-sm text-gray-400">Match</p>
                        <p className="text-2xl font-bold text-[#10b981]">{job.match || 100}%</p>
                      </div>
                      <button onClick={e => {
                    e.stopPropagation();
                  }} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                        <BookmarkPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location || 'Remote'}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {typeof job.salaryRange === 'string' ? job.salaryRange : (job.salaryRange?.min ? `$${job.salaryRange.min.toLocaleString()}` : '$100k+')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.employmentType || job.jobType || job.job_type}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                      {(job.requiredSkills || []).slice(0, 4).map(skill => <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm">
                          {skill}
                        </span>)}
                    </div>
                    <button onClick={e => {
                  e.stopPropagation();
                  setApplyModalState({
                    isOpen: true,
                    jobId: job._id,
                    jobTitle: job.jobTitle,
                    company: job.companyName || job.department
                  });
                }} className="px-4 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all flex items-center gap-2 flex-shrink-0">
                      <Send className="w-4 h-4" />
                      Quick Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
        
        {/* Pagination UI */}
        {pagination?.totalPages > 1 && (
          <Pagination className="mb-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-white/10"}
                />
              </PaginationItem>
              
              {/* Simple page numbers */}
              {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                const page = idx + 1;
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 || 
                  page === pagination.totalPages || 
                  (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={page === pagination.currentPage}
                        onClick={() => handlePageChange(page)}
                        className={`cursor-pointer ${page === pagination.currentPage ? "bg-[#1f7af9] text-white border-none hover:bg-[#1f7af9]/90" : "hover:bg-white/10 text-gray-300"}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  page === pagination.currentPage - 2 || 
                  page === pagination.currentPage + 2
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-white/10"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* Apply Job Modal */}
        <ApplyJobModal isOpen={applyModalState.isOpen} onClose={() => setApplyModalState({
        ...applyModalState,
        isOpen: false
      })} jobId={applyModalState.jobId} jobTitle={applyModalState.jobTitle} company={applyModalState.company} />
      </div>
    </div>;
}
