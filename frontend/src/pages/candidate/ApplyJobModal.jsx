import { useState } from 'react';
import { X, Upload, FileText, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
export function ApplyJobModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  company
}) {
  const [step, setStep] = useState('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeFile: null,
    coverLetter: '',
    linkedIn: '',
    portfolio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resumeFile: e.target.files[0]
      });
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!jobId) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      if (formData.resumeFile) fd.append('file', formData.resumeFile);
      if (formData.portfolio) fd.append('portfolio_link', formData.portfolio);
      if (formData.fullName) fd.append('fullName', formData.fullName);
      if (formData.email) fd.append('email', formData.email);
      if (formData.phone) fd.append('phone', formData.phone);
      if (formData.coverLetter) fd.append('coverLetter', formData.coverLetter);
      if (formData.linkedIn) fd.append('linkedIn', formData.linkedIn);

      const { applyJobAPI } = await import('../../api/api');
      await applyJobAPI(jobId, fd);

      setStep('success');
      setTimeout(() => {
        onClose();
        setStep('form');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          resumeFile: null,
          coverLetter: '',
          linkedIn: '',
          portfolio: ''
        });
      }, 3000);
    } catch (err) {
      const toast = (await import('react-hot-toast')).default;
      toast.error(err?.message || "Application failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
  return <AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="relative w-full max-w-2xl bg-[#1a2332] border border-white/10 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
        {step === 'form' ? <>
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Apply for Position</h2>
                <p className="text-gray-400">{jobTitle} at {company}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <input type="text" required value={formData.fullName} onChange={e => setFormData({
                      ...formData,
                      fullName: e.target.value
                    })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 text-white" placeholder="John Doe" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 text-white" placeholder="john@example.com" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                    <input type="tel" required value={formData.phone} onChange={e => setFormData({
                      ...formData,
                      phone: e.target.value
                    })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 text-white" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">LinkedIn Profile</label>
                    <input type="url" value={formData.linkedIn} onChange={e => setFormData({
                      ...formData,
                      linkedIn: e.target.value
                    })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 text-white" placeholder="linkedin.com/in/johndoe" />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Resume *</h3>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[#1f7af9]/50 transition-all cursor-pointer group">
                  <input type="file" id="resume-upload" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" required />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {formData.resumeFile ? <div className="flex items-center justify-center gap-3 text-[#10b981]">
                      <FileText className="w-8 h-8" />
                      <div className="text-left">
                        <p className="font-semibold">{formData.resumeFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(formData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div> : <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-[#1f7af9] transition-colors" />
                      <p className="text-white mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    </>}
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Cover Letter</h3>
                <textarea value={formData.coverLetter} onChange={e => setFormData({
                  ...formData,
                  coverLetter: e.target.value
                })} className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none text-white" placeholder="Tell us why you're a great fit for this role..." />
                <p className="text-xs text-gray-500 mt-2">Optional but recommended</p>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Portfolio / Website</label>
                <input type="url" value={formData.portfolio} onChange={e => setFormData({
                  ...formData,
                  portfolio: e.target.value
                })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 text-white" placeholder="https://yourportfolio.com" />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-gray-500">* Required fields</p>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center gap-2 text-white disabled:opacity-50">
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </> : (/* Success State */
          <div className="p-12 text-center">
            <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              type: 'spring',
              duration: 0.5
            }} className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }}>
              <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
              <p className="text-xl text-gray-400 mb-2">
                Your application for <span className="text-white font-semibold">{jobTitle}</span>
              </p>
              <p className="text-xl text-gray-400 mb-8">
                at <span className="text-white font-semibold">{company}</span> has been received.
              </p>

              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md mx-auto">
                <p className="text-sm text-gray-400 mb-4">What happens next?</p>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <span className="text-[#10b981] mt-0.5">✓</span>
                    <span className="text-gray-300">Your application is being reviewed by our AI system</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="text-[#10b981] mt-0.5">✓</span>
                    <span className="text-gray-300">You'll receive an email confirmation shortly</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <span className="text-[#10b981] mt-0.5">✓</span>
                    <span className="text-gray-300">Track your application status in your dashboard</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>)}
      </motion.div>
    </div>
  </AnimatePresence>;
}
