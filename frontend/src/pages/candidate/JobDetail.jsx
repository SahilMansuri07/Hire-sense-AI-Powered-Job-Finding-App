import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';
import { fetchSingleJobAPI } from '../../api/api';

export function JobDetail() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSingleJobAPI(id)
      .then(res => setJob(res?.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f1723] text-white flex justify-center items-center">Loading...</div>;
  if (!job) return <div className="min-h-screen bg-[#0f1723] text-white flex justify-center items-center">Job not found</div>;
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/candidate/jobs')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              🏢
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{job.jobTitle}</h1>
              <p className="text-xl text-gray-400 mb-4">{job.companyName || job.department || 'Company'}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {job.location || 'Remote'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  {typeof job.salaryRange === 'string' ? job.salaryRange : 'Competitive'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  {job.employmentType || job.jobType}
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setIsApplyModalOpen(true)} className="w-full py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Apply Now
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Job Description */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="space-y-3 text-gray-400 whitespace-pre-line">
              <p>{job.description}</p>
              {job.requirements && (
                <>
                  <p className="font-semibold text-white mt-6 mb-2">Requirements:</p>
                  <p>{job.requirements}</p>
                </>
              )}
              {job.benefits && (
                <>
                  <p className="font-semibold text-white mt-6 mb-2">Benefits:</p>
                  <p>{job.benefits}</p>
                </>
              )}
            </div>
          </div>


        </div>

        {/* Skills Comparison */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(job.requiredSkills || []).map(skill => (
              <span key={skill} className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded-lg text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Apply Job Modal */}
        <ApplyJobModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} jobId={job._id} jobTitle={job.jobTitle} company={job.companyName || job.department || 'Company'} />
      </div>
    </div>;
}
