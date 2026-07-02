import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  fetchRecruiterJobsAPI, 
  deleteJobAPI 
} from '../../api/recruiterJobsApi';
import { 
  Plus, Edit2, Trash2, MapPin, Briefcase, 
  Calendar, FileText, ChevronLeft, ChevronRight, CheckCircle, XCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
export function RecruiterJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const limit = 10;
  
  // Modal State removed as we use pages now

  // Fetch Jobs
  const loadJobs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetchRecruiterJobsAPI(page, limit);
      
      if (res?.data) {
        if (Array.isArray(res.data)) {
          // Gracefully handle flat array structure (if backend pagination isn't active yet)
          setJobs(res.data);
          setTotalPages(1);
          setTotalJobs(res.data.length);
        } else if (res.data.jobs) {
          // Proper paginated shape
          setJobs(res.data.jobs);
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages || 1);
            setTotalJobs(res.data.pagination.total || 0);
            setCurrentPage(res.data.pagination.currentPage || 1);
          }
        }
      }
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage]);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    // Optimistic Update
    const originalJobs = [...jobs];
    setJobs(jobs.filter(j => j._id !== jobId));
    
    try {
      await deleteJobAPI(jobId);
      toast.success('Job deleted successfully');
      // Refetch to ensure total counts are updated correctly
      loadJobs(currentPage);
    } catch (err) {
      setJobs(originalJobs);
      toast.error('Failed to delete job');
    }
  };

  const openEditModal = (jobId) => {
    navigate(`/recruiter/edit-job/${jobId}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Job Management</h1>
          <p className="text-gray-400">Create, edit, and manage your job postings ({totalJobs} total)</p>
        </div>
        <button 
          onClick={() => navigate('/recruiter/post-job')}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1f7af9]/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {/* Job List */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-400 text-sm">Job Title & Details</th>
                <th className="px-6 py-4 font-semibold text-gray-400 text-sm">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-400 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-400 text-sm">Applications</th>
                <th className="px-6 py-4 font-semibold text-gray-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div><div className="h-3 bg-white/5 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-white/10 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-white/10 rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No jobs found. Click "Post New Job" to get started.</p>
                  </td>
                </tr>
              ) : (
                jobs.map(job => (
                  <tr key={job._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{job.jobTitle}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> {job.department}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {job.employmentType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" /> {job.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {job.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {job.applicationCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(job._id)}
                          className="p-2 hover:bg-[#1f7af9]/20 hover:text-[#1f7af9] rounded-lg transition-colors text-gray-400"
                          title="Edit Job"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(job._id)}
                          className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
