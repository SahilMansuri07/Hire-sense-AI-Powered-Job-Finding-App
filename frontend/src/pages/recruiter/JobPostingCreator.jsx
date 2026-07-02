import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Sparkles, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateJobDescriptionAPI, postJobAPI, editJobAPI, fetchJobByIdAPI } from '../../api/recruiterJobsApi';

export function JobPostingCreator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    jobType: 'on-site',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    skills: []
  });
  const [aiGenerated, setAiGenerated] = useState(false);
  const skillSuggestions = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB'];

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const res = await fetchJobByIdAPI(id);
          const job = res.data?.data || res.data;
          if (job) {
            setFormData({
              title: job.jobTitle || '',
              department: job.department || '',
              location: job.location || '',
              type: job.employmentType || 'Full-time',
              jobType: job.job_type || job.jobType || 'on-site',
              salary: typeof job.salaryRange === 'object' ? `${job.salaryRange.min || ''}${job.salaryRange.max ? ' - ' + job.salaryRange.max : ''}` : (job.salaryRange || ''),
              description: job.jobDescription?.description || job.description || '',
              requirements: job.jobDescription?.requirements || job.requirements || '',
              benefits: job.jobDescription?.benefits || job.benefits || '',
              skills: job.requiredSkills || []
            });
            if (job.jobDescription?.description) setAiGenerated(true);
          }
        } catch (error) {
          toast.error('Failed to load job details');
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.department || !formData.location || !formData.salary || formData.skills.length === 0) {
      toast.error('Please fill the basic information and required skills first');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        jobTitle: formData.title,
        department: formData.department,
        location: formData.location,
        employmentType: formData.type,
        salaryRange: formData.salary,
        requiredSkills: formData.skills
      };
      
      const response = await generateJobDescriptionAPI(payload);
      console.log(response);
      
      // Axios puts response body in .data, and our backend wraps data in .data
      const jobDescription = response.data?.data?.jobDescription || response.data?.jobDescription || {};
      
      setFormData(prev => ({
        ...prev,
        description: jobDescription.description || '',
        requirements: jobDescription.requirements || '',
        benefits: jobDescription.benefits || ''
      }));
      setAiGenerated(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate job description');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (status = 'published') => {
    if (!formData.title || !formData.department) {
      toast.error('Title and department are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        jobTitle: formData.title,
        department: formData.department,
        location: formData.location,
        employmentType: formData.type,
        jobType: formData.jobType,
        salaryRange: formData.salary,
        requiredSkills: formData.skills,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        jobDescription: {
          description: formData.description,
          requirements: formData.requirements,
          benefits: formData.benefits
        },
        status
      };

      if (id) {
        payload.jobId = id;
        await editJobAPI(payload);
        toast.success('Job updated successfully!');
      } else {
        await postJobAPI(payload);
        toast.success(status === 'published' ? 'Job published successfully!' : 'Draft saved successfully!');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };
  const handleSkillToggle = skill => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
    }));
  };
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{id ? 'Edit Job Posting' : 'Create Job Posting'}</h1>
          <p className="text-gray-400">Use AI to generate a compelling job description</p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={formData.title} onChange={e => setFormData({
                  ...formData,
                  title: e.target.value
                })} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" placeholder="e.g., Senior Frontend Developer" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Department</label>
                <select value={formData.department} onChange={e => setFormData({
                ...formData,
                department: e.target.value
              })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20">
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={formData.location} onChange={e => setFormData({
                  ...formData,
                  location: e.target.value
                })} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" placeholder="e.g., San Francisco, CA (Remote)" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Employment Type</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select value={formData.type} onChange={e => setFormData({
                  ...formData,
                  type: e.target.value
                })} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Job Type</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select value={formData.jobType} onChange={e => setFormData({
                  ...formData,
                  jobType: e.target.value
                })} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20">
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Salary Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={formData.salary} onChange={e => setFormData({
                  ...formData,
                  salary: e.target.value
                })} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" placeholder="e.g., $120,000 - $180,000" />
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map(skill => <button key={skill} onClick={() => handleSkillToggle(skill)} className={`px-4 py-2 rounded-xl border transition-all ${formData.skills.includes(skill) ? 'bg-[#1f7af9]/20 border-[#1f7af9] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                  {skill}
                </button>)}
            </div>
          </div>

          {/* AI-Generated Content */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Job Description</h3>
              <button onClick={handleAIGenerate} disabled={loading} className="px-6 py-2 bg-gradient-to-r from-[#bc13fe] to-[#8a0ebd] rounded-lg hover:shadow-lg hover:shadow-[#bc13fe]/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Sparkles className="w-4 h-4" />
                AI Generate
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none" placeholder="Describe the role and responsibilities..." />
              </div>

              <div>
                <label className="block text-sm mb-2">Requirements</label>
                <textarea value={formData.requirements} onChange={e => setFormData({
                ...formData,
                requirements: e.target.value
              })} className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none" placeholder="List the requirements and qualifications..." />
              </div>

              <div>
                <label className="block text-sm mb-2">Benefits</label>
                <textarea value={formData.benefits} onChange={e => setFormData({
                ...formData,
                benefits: e.target.value
              })} className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none" placeholder="What benefits does this position offer..." />
              </div>
            </div>

            {aiGenerated && <div className="mt-4 p-4 bg-gradient-to-r from-[#bc13fe]/20 to-[#bc13fe]/5 border border-[#bc13fe]/50 rounded-xl">
                <div className="flex items-center gap-2 text-[#bc13fe]">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">AI-generated content ready! Review and customize as needed.</span>
                </div>
              </div>}
          </div>

          {/* Publish Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => handleSubmit('published')} 
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all disabled:opacity-50"
            >
              {submitting ? (id ? 'Updating...' : 'Publishing...') : (id ? 'Update Job Posting' : 'Publish Job Posting')}
            </button>
            <button 
              disabled={submitting}
              onClick={() => handleSubmit('draft')} 
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              Save Draft
            </button>
            <button 
              disabled={submitting}
              onClick={() => navigate('/recruiter/jobs')} 
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>;
}
