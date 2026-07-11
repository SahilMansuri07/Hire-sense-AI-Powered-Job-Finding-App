import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search, MapPin, DollarSign, Briefcase, Bookmark, ArrowLeft, SlidersHorizontal,
  Send, Award, X, ChevronDown, Building2, Clock, Users, Sparkles, Check
} from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';
import { fetchJobsThunk, setFilters, setPage } from '../../redux/slices/jobListingSlice';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../../components/ui/pagination';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSalary(job) {
  if (typeof job.salaryRange === 'string') return job.salaryRange;
  const min = job.salaryRange?.min;
  const max = job.salaryRange?.max;
  if (min && max) return `$${(min / 1000).toFixed(0)}k – $${(max / 1000).toFixed(0)}k`;
  if (min) return `$${(min / 1000).toFixed(0)}k+`;
  return 'Not disclosed';
}

function timeAgo(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  if (days < 7) return `Posted ${days}d ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best match' },
  { value: 'newest', label: 'Newest' },
  { value: 'salary_desc', label: 'Salary: high to low' },
];

// ---------------------------------------------------------------------------
// Skeleton row shown while a page of results is loading
// ---------------------------------------------------------------------------

function JobRowSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-lg bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-white/10 rounded" />
          <div className="h-3 w-1/3 bg-white/10 rounded" />
          <div className="h-3 w-1/2 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact job row for the list column
// ---------------------------------------------------------------------------

function JobRow({ job, isActive, isSaved, onSelect, onToggleSave, onQuickApply }) {
  const posted = timeAgo(job.postedAt || job.createdAt);
  return (
    <div
      onClick={onSelect}
      className={`group relative p-4 rounded-xl border cursor-pointer transition-all
        ${isActive
          ? 'bg-[#1f7af9]/10 border-[#1f7af9]/60 shadow-[0_0_0_1px_rgba(31,122,249,0.4)]'
          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'}`}
    >
      {isActive && <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-[#1f7af9]" />}
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#1f7af9]/25 to-[#bc13fe]/25 flex items-center justify-center text-lg flex-shrink-0 font-semibold">
          {(job.companyName || 'C')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-[15px] leading-snug truncate group-hover:text-[#1f7af9] transition-colors">
                {job.jobTitle}
              </h3>
              <p className="text-sm text-gray-400 truncate">{job.companyName || job.department || 'Company'}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onToggleSave(); }}
              className="p-1.5 rounded-md hover:bg-white/10 flex-shrink-0 transition-colors"
              aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? 'fill-[#1f7af9] text-[#1f7af9]' : 'text-gray-400'}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || 'Remote'}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatSalary(job)}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.employmentType || job.jobType || job.job_type || 'Full-time'}</span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {typeof job.match === 'number' && (
                <span className="flex items-center gap-1 text-xs font-medium text-[#10b981]">
                  <Sparkles className="w-3 h-3" />{job.match}% match
                </span>
              )}
              {posted && <span className="text-xs text-gray-500">{posted}</span>}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onQuickApply(); }}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#1f7af9] transition-all flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail panel shown for the selected job (sticky on desktop, full-screen on mobile)
// ---------------------------------------------------------------------------

function JobDetailPanel({ job, isSaved, onToggleSave, onApply, onBack, showBack }) {
  if (!job) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[420px] text-center px-8 rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Briefcase className="w-6 h-6 text-gray-500" />
        </div>
        <p className="text-gray-400 font-medium">Select a job to see the details</p>
        <p className="text-sm text-gray-500 mt-1">Your matches are listed on the left</p>
      </div>
    );
  }

  const posted = timeAgo(job.postedAt || job.createdAt);
  const skills = job.requiredSkills || [];

  // jobDescription can arrive either as a plain string or as a structured
  // object like { description, requirements, benefits } depending on the
  // source — normalize both shapes here rather than rendering raw objects.
  const rawDescription = job.jobDescription || job.description;
  const isStructuredDescription = rawDescription && typeof rawDescription === 'object';

  const description = isStructuredDescription
    ? (rawDescription.description || 'No description provided for this role yet.')
    : (rawDescription || 'No description provided for this role yet.');

  const requirements = (
    (isStructuredDescription && rawDescription.requirements) ||
    job.requirements ||
    job.qualifications ||
    []
  );
  const requirementsList = Array.isArray(requirements)
    ? requirements
    : (typeof requirements === 'string' ? requirements.split('\n').filter(Boolean) : []);

  const benefits = (isStructuredDescription && rawDescription.benefits) || job.benefits || [];
  const benefitsList = Array.isArray(benefits)
    ? benefits
    : (typeof benefits === 'string' ? benefits.split('\n').filter(Boolean) : []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-6 border-b border-white/10">
        {showBack && (
          <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors lg:hidden">
            <ArrowLeft className="w-4 h-4" /> Back to results
          </button>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1f7af9]/25 to-[#bc13fe]/25 flex items-center justify-center text-2xl font-semibold flex-shrink-0">
              {(job.companyName || 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-snug">{job.jobTitle}</h2>
              <p className="text-gray-400 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5" />{job.companyName || job.department || 'Company'}
              </p>
            </div>
          </div>
          {typeof job.match === 'number' && (
            <div className="px-4 py-2 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/40 rounded-lg text-center flex-shrink-0">
              <p className="text-[11px] text-gray-400">Match</p>
              <p className="text-xl font-bold text-[#10b981]">{job.match}%</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"><MapPin className="w-3.5 h-3.5" />{job.location || 'Remote'}</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"><DollarSign className="w-3.5 h-3.5" />{formatSalary(job)}</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"><Briefcase className="w-3.5 h-3.5" />{job.employmentType || job.jobType || job.job_type || 'Full-time'}</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"><Award className="w-3.5 h-3.5" />{job.expiriance_level || job.experience_level || 'Entry-level'}</span>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onApply}
            className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-medium hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Apply now
          </button>
          <button
            onClick={onToggleSave}
            className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${isSaved ? 'border-[#1f7af9]/60 bg-[#1f7af9]/10 text-[#1f7af9]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          {posted && <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 ml-auto"><Clock className="w-3.5 h-3.5" />{posted}</span>}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">About the role</h3>
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{typeof description === 'string' ? description : JSON.stringify(description)}</p>
        </section>

        {skills.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">{skill}</span>
              ))}
            </div>
          </section>
        )}

        {requirementsList.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">Requirements</h3>
            <ul className="space-y-2">
              {requirementsList.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />{typeof r === 'string' ? r : JSON.stringify(r)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {benefitsList.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-2">Benefits</h3>
            <ul className="space-y-2">
              {benefitsList.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-[#bc13fe] flex-shrink-0 mt-0.5" />{typeof b === 'string' ? b : JSON.stringify(b)}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function JobSearch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { jobs, pagination, filters: reduxFilters, loading } = useSelector(state => state.jobListing);

  const [localSearch, setLocalSearch] = useState(reduxFilters.search || '');
  const [localFilters, setLocalFilters] = useState({
    location: reduxFilters.location || '',
    salaryMin: reduxFilters.salaryMin || '',
    salaryMax: reduxFilters.salaryMax || '',
    type: reduxFilters.employmentType || '',
    remote: reduxFilters.is_remote || false,
    experience_level: reduxFilters.experience_level || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(() => new Set());
  const [applyModalState, setApplyModalState] = useState({ isOpen: false, jobTitle: '', company: '' });
  const listTopRef = useRef(null);

  // Commit local filters to Redux (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({
        search: localSearch,
        location: localFilters.location,
        employmentType: localFilters.type,
        salaryMin: localFilters.salaryMin,
        salaryMax: localFilters.salaryMax,
        is_remote: localFilters.remote,
        experience_level: localFilters.experience_level
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, localFilters, dispatch]);

  // Fetch jobs when Redux filters or page changes
  useEffect(() => {
    dispatch(fetchJobsThunk({
      ...reduxFilters,
      page: pagination.currentPage,
      limit: pagination.limit
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, reduxFilters, pagination.currentPage, pagination.limit]);

  // Keep the sort selection applied client-side (server sort param can be wired in later)
  const sortedJobs = useMemo(() => {
    const list = [...jobs];
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.postedAt || b.createdAt || 0) - new Date(a.postedAt || a.createdAt || 0));
    } else if (sort === 'salary_desc') {
      list.sort((a, b) => (b.salaryRange?.min || 0) - (a.salaryRange?.min || 0));
    }
    return list;
  }, [jobs, sort]);

  // Default to the first result once a page loads, on desktop only
  useEffect(() => {
    if (!loading && sortedJobs.length > 0 && !sortedJobs.some(j => j._id === selectedJobId)) {
      if (window.innerWidth >= 1024) setSelectedJobId(sortedJobs[0]._id);
      else setSelectedJobId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedJobs, loading]);

  const selectedJob = sortedJobs.find(j => j._id === selectedJobId) || null;

  const activeFilterChips = [
    localFilters.location && { key: 'location', label: localFilters.location },
    localFilters.experience_level && { key: 'experience_level', label: localFilters.experience_level },
    (localFilters.salaryMin || localFilters.salaryMax) && { 
      key: 'salary', 
      label: localFilters.salaryMin && localFilters.salaryMax 
        ? `$${Number(localFilters.salaryMin).toLocaleString()} - $${Number(localFilters.salaryMax).toLocaleString()}`
        : localFilters.salaryMin ? `$${Number(localFilters.salaryMin).toLocaleString()}+`
        : `Up to $${Number(localFilters.salaryMax).toLocaleString()}`
    },
    localFilters.type && { key: 'type', label: localFilters.type },
    localFilters.remote && { key: 'remote', label: 'Remote' },
  ].filter(Boolean);

  const clearFilter = (key) => {
    if (key === 'salary') {
      setLocalFilters(prev => ({ ...prev, salaryMin: '', salaryMax: '' }));
    } else {
      setLocalFilters(prev => ({ ...prev, [key]: key === 'remote' ? false : '' }));
    }
  };

  const clearAllFilters = () => {
    setLocalFilters({ location: '', salaryMin: '', salaryMax: '', type: '', remote: false, experience_level: '' });
  };

  const toggleSave = (jobId) => {
    setSavedJobIds(prev => {
      const next = new Set(prev);
      next.has(jobId) ? next.delete(jobId) : next.add(jobId);
      return next;
    });
  };

  const openApply = (job) => setApplyModalState({
    isOpen: true,
    jobId: job._id,
    jobTitle: job.jobTitle,
    company: job.companyName || job.department
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setPage(newPage));
      listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Sticky top bar: back link, title, search, filters */}
      <div className="sticky top-0 z-20 bg-[#0f1723]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <button onClick={() => navigate('/candidate/dashboard')} className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold">Find Your Dream Job</h1>
              <p className="text-gray-400 text-sm mt-1">AI-matched opportunities tailored for you</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search by role, company, or skill..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors flex-shrink-0
                ${showFilters ? 'bg-[#1f7af9]/15 border-[#1f7af9]/50 text-[#1f7af9]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterChips.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#1f7af9] text-white text-xs flex items-center justify-center">{activeFilterChips.length}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={localFilters.location} onChange={e => setLocalFilters({ ...localFilters, location: e.target.value })} placeholder="Location" className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm" />
              </div>
              <select value={localFilters.experience_level} onChange={e => setLocalFilters({ ...localFilters, experience_level: e.target.value })} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm">
                <option value="">Experience</option>
                <option value="Entry-level">Entry Level (0-2 years)</option>
                <option value="Junior">Junior (2-4 years)</option>
                <option value="Mid-level">Mid Level (4-6 years)</option>
                <option value="Senior-level">Senior (6-10 years)</option>
                <option value="Lead">Lead (10+ years)</option>
                <option value="Principal">Principal (15+ years)</option>
                <option value="Other">Other</option>
              </select>
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" min="0" value={localFilters.salaryMin} onChange={e => {
                      const val = e.target.value;
                      if (!val || Number(val) >= 0) setLocalFilters({ ...localFilters, salaryMin: val });
                    }} placeholder="Min Salary" className="w-full pl-7 pr-2 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm" />
                </div>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" min="0" value={localFilters.salaryMax} onChange={e => {
                      const val = e.target.value;
                      if (!val || Number(val) >= 0) setLocalFilters({ ...localFilters, salaryMax: val });
                    }} placeholder="Max Salary" className={`w-full pl-7 pr-2 py-2 bg-white/5 border rounded-lg focus:outline-none text-sm transition-colors ${
                      localFilters.salaryMin && localFilters.salaryMax && Number(localFilters.salaryMax) < Number(localFilters.salaryMin)
                      ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#1f7af9]'
                    }`} />
                </div>
              </div>
              <select value={localFilters.type} onChange={e => setLocalFilters({ ...localFilters, type: e.target.value })} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#1f7af9] text-sm">
                <option value="">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
              <label className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" checked={localFilters.remote} onChange={e => setLocalFilters({ ...localFilters, remote: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm">Remote only</span>
              </label>
            </div>
          )}

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {activeFilterChips.map(chip => (
                <span key={chip.key} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-[#1f7af9]/10 border border-[#1f7af9]/30 text-[#1f7af9] rounded-lg text-xs font-medium">
                  {chip.label}
                  <button onClick={() => clearFilter(chip.key)} className="hover:bg-[#1f7af9]/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-white underline underline-offset-2">Clear all</button>
            </div>
          )}
        </div>
      </div>

      <div ref={listTopRef} className="max-w-7xl mx-auto px-6 py-6">
        {/* Results count + sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-semibold">{pagination?.total ?? jobs.length}</span> jobs matching your profile
          </p>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#1f7af9] cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Split view: list + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-6 items-start">
          {/* List column */}
          <div className={`space-y-3 ${selectedJob ? 'hidden lg:block' : ''}`}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <JobRowSkeleton key={i} />)
            ) : sortedJobs.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                <Users className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-300 font-medium">No jobs match your filters</p>
                <p className="text-sm text-gray-500 mt-1">Try widening your search or clearing a filter</p>
                {activeFilterChips.length > 0 && (
                  <button onClick={clearAllFilters} className="mt-4 text-sm text-[#1f7af9] hover:underline">Clear all filters</button>
                )}
              </div>
            ) : (
              sortedJobs.map(job => (
                <JobRow
                  key={job._id}
                  job={job}
                  isActive={job._id === selectedJobId}
                  isSaved={savedJobIds.has(job._id)}
                  onSelect={() => setSelectedJobId(job._id)}
                  onToggleSave={() => toggleSave(job._id)}
                  onQuickApply={() => openApply(job)}
                />
              ))
            )}

            {pagination?.totalPages > 1 && (
              <Pagination className="pt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className={pagination.currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-white/10'}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    if (page === 1 || page === pagination.totalPages || (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === pagination.currentPage}
                            onClick={() => handlePageChange(page)}
                            className={`cursor-pointer ${page === pagination.currentPage ? 'bg-[#1f7af9] text-white border-none hover:bg-[#1f7af9]/90' : 'hover:bg-white/10 text-gray-300'}`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                      return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className={pagination.currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-white/10'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>

          {/* Detail column */}
          <div className={`${selectedJob ? '' : 'hidden lg:block'} lg:sticky lg:top-[calc(1.5rem+var(--header-h,0px))]`}>
            <JobDetailPanel
              job={selectedJob}
              isSaved={selectedJob ? savedJobIds.has(selectedJob._id) : false}
              onToggleSave={() => selectedJob && toggleSave(selectedJob._id)}
              onApply={() => selectedJob && openApply(selectedJob)}
              onBack={() => setSelectedJobId(null)}
              showBack
            />
          </div>
        </div>
      </div>

      <ApplyJobModal
        isOpen={applyModalState.isOpen}
        onClose={() => setApplyModalState({ ...applyModalState, isOpen: false })}
        jobId={applyModalState.jobId}
        jobTitle={applyModalState.jobTitle}
        company={applyModalState.company}
      />
    </div>
  );
}