import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Briefcase, Code, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { setupPreferencesAPI, uploadResumeAPI, getJobRolesAPI, getJobRoleSkillsAPI } from '../../api/api';
import { updateUser } from '../../redux/slices/authSlice';
import { authStorage } from '../../utils/authStorage';
import toast from 'react-hot-toast';

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    resume: null,
    jobRoleId: '',
    jobRoleName: '',
    experience: '',
    skills: [],
    jobDescription: ''
  });
  const dispatch = useDispatch();
  const [skillOptions, setSkillOptions] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete state
  const [jobRoleSearch, setJobRoleSearch] = useState('');
  const [jobRoleResults, setJobRoleResults] = useState([]);
  const [isSearchingJobRoles, setIsSearchingJobRoles] = useState(false);
  const [showJobRoleDropdown, setShowJobRoleDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowJobRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowJobRoleDropdown(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    const fetchRoles = async () => {
      setIsSearchingJobRoles(true);
      try {
        const res = await getJobRolesAPI(jobRoleSearch);
        setJobRoleResults(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingJobRoles(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (showJobRoleDropdown) {
        fetchRoles();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [jobRoleSearch, showJobRoleDropdown]);

  const handleJobRoleSelect = async (role) => {
    setFormData(prev => ({
      ...prev,
      jobRoleId: role._id,
      jobRoleName: role.name,
      skills: [] // Reset skills on role change
    }));
    setJobRoleSearch(role.name);
    setShowJobRoleDropdown(false);

    try {
      const res = await getJobRoleSkillsAPI(role._id);
      setSkillOptions(res?.data || []);
    } catch (err) {
      console.error(err);
      setSkillOptions([]);
    }
  };

  const highlightMatch = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <span key={i} className="text-[#1f7af9] font-semibold">{part}</span> : part
    );
  };

  // Removed global getSkillsAPI call
  const handleSkillToggle = skillId => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId) ? prev.skills.filter(s => s !== skillId) : [...prev.skills, skillId]
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Only PDF files are allowed!");
      return;
    }
    setFormData(prev => ({ ...prev, resume: file }));
    toast.success("Resume attached!");
    setStep(2);
  };

  const { user } = useSelector(state => state.auth);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      if (formData.resume && formData.resume instanceof File) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
          toast.error("Cloudinary configuration is missing in frontend .env");
          setIsSubmitting(false);
          return;
        }

        const fd = new FormData();
        fd.append('file', formData.resume);
        fd.append('upload_preset', uploadPreset);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
          method: 'POST',
          body: fd
        });

        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) {
          throw new Error(cloudData.error?.message || "Failed to upload resume to Cloudinary");
        }

        const payload = {
          resumeUrl: cloudData.secure_url,
          fileName: formData.resume.name,
          fileSize: formData.resume.size,
          fileType: formData.resume.type,
          cloudinaryPublicId: cloudData.public_id,
          job_description: formData.jobRoleName || ''
        };

        const res = await uploadResumeAPI(payload);
        if (res?.data) {
          authStorage.setResumeAnalysis(user?._id || 'unknown', res.data);
        }
      }

      const payload = {
        jobRoleId: formData.jobRoleId,
        experienceLevel: formData.experience,
        Skills: formData.skills
      };
      await setupPreferencesAPI(payload);
      dispatch(updateUser({ jobRole: formData.jobRoleName, experience: formData.experience, skills: formData.skills }));
      toast.success("Setup complete!");
      navigate('/candidate/dashboard');
    } catch (err) {
      toast.error(err?.message || "Failed to save preferences");
    } finally {
      setIsSubmitting(false);
    }
  };
  const steps = [{
    number: 1,
    title: 'Upload Resume',
    icon: Upload
  }, {
    number: 2,
    title: 'Job Role',
    icon: Briefcase
  }, {
    number: 3,
    title: 'Skills',
    icon: Code
  }, {
    number: 4,
    title: 'Experience',
    icon: CheckCircle
  }, {
    number: 5,
    title: 'Confirm',
    icon: CheckCircle
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
    <div className="max-w-4xl mx-auto pt-12">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.number ? 'bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] border-transparent' : 'bg-white/5 border-white/20'}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-2 text-gray-400">{s.title}</span>
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step > s.number ? 'bg-[#1f7af9]' : 'bg-white/10'}`} />}
          </div>)}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
        {step === 1 && <div>
          <h2 className="text-3xl font-bold mb-2">Upload Your Resume</h2>
          <p className="text-gray-400 mb-8">We'll analyze it to provide personalized recommendations</p>

          <label className="block border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-[#1f7af9]/50 transition-all cursor-pointer group">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-[#1f7af9] transition-colors" />
            <p className="text-lg mb-2">{formData.resume ? formData.resume.name : "Click to upload or drag and drop"}</p>
            <p className="text-sm text-gray-500">PDF ONLY (Max 5MB)</p>
            <input type="file" className="hidden" accept=".pdf,application/pdf" onChange={handleResumeUpload} disabled={isUploading} />
          </label>
          <div className="text-center mt-4">
            <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white underline">Skip for now</button>
          </div>
        </div>}

        {step === 2 && <div>
          <h2 className="text-3xl font-bold mb-2">Job Role</h2>
          <p className="text-gray-400 mb-8">Tell us what role you're applying for</p>

          <div className="space-y-6">
            <div ref={dropdownRef} className="relative">
              <label className="block text-sm mb-2">Desired Job Role</label>
              <div className="relative">
                <input type="text" value={jobRoleSearch} onFocus={() => setShowJobRoleDropdown(true)} onChange={e => {
                  setJobRoleSearch(e.target.value);
                  setShowJobRoleDropdown(true);
                  if (formData.jobRoleId) {
                    setFormData(prev => ({ ...prev, jobRoleId: '', jobRoleName: '' }));
                  }
                }} className={`w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 ${!formData.jobRoleId && jobRoleSearch ? 'border-red-500' : 'border-white/10'}`} placeholder="e.g., Senior Frontend Developer" />
                {isSearchingJobRoles && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>
              {!formData.jobRoleId && jobRoleSearch && !showJobRoleDropdown && (
                <p className="text-red-500 text-xs mt-1">Please select a valid job role from the list.</p>
              )}
              {showJobRoleDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-[#1a2332] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {isSearchingJobRoles ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                  ) : jobRoleResults.length > 0 ? (
                    jobRoleResults.map(role => (
                      <div
                        key={role._id}
                        onClick={() => handleJobRoleSelect(role)}
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors text-sm"
                      >
                        {highlightMatch(role.name, jobRoleSearch)}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>}

        {step === 3 && <div>
          <h2 className="text-3xl font-bold mb-2">Your Skills</h2>
          <p className="text-gray-400 mb-8">Select all skills that apply to you</p>

          {skillOptions.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {skillOptions.map(skill => <button key={skill} onClick={() => handleSkillToggle(skill)} className={`px-4 py-3 rounded-xl border transition-all ${formData.skills.includes(skill) ? 'bg-[#1f7af9]/20 border-[#1f7af9] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                {skill}
              </button>)}
            </div>
          ) : (
            <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-gray-400">No specific skills found for this role yet. We will configure default recommendations.</p>
            </div>
          )}
        </div>}

        {step === 4 && <div>
          <h2 className="text-3xl font-bold mb-2">Experience Level</h2>
          <p className="text-gray-400 mb-8">Select your professional experience level</p>

          <div>
            <select value={formData.experience} onChange={e => setFormData({
              ...formData,
              experience: e.target.value
            })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20">
              <option value="">Select experience level</option>
              <option value="Fresher">Fresher</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>}

        {step === 5 && <div>
          <h2 className="text-3xl font-bold mb-2">All Set!</h2>
          <p className="text-gray-400 mb-8">Review your profile before we get started</p>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <span className="text-sm text-gray-400">Job Role</span>
              <p className="font-semibold">{formData.jobRoleName || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <span className="text-sm text-gray-400">Experience</span>
              <p className="font-semibold">{formData.experience || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <span className="text-sm text-gray-400">Skills</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>}
          <div className="flex-1" />
          <button
            onClick={() => step === 5 ? handleComplete() : setStep(step + 1)}
            disabled={isSubmitting || (step === 2 && !formData.jobRoleId) || (step === 3 && formData.skills.length === 0 && skillOptions.length > 0) || (step === 4 && !formData.experience)}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all disabled:opacity-50"
          >
            {step === 5 ? (isSubmitting ? 'Saving...' : 'Complete Setup') : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>;
}
