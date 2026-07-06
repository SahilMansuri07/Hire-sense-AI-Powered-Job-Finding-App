import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import { uploadResumeAPI } from '../../api/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { authStorage } from '../../utils/authStorage';

export function ATSAnalyzer() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useSelector(state => state.auth);

  const handleUpload = async () => {
    if (!file) return toast.error("Please upload a resume first");
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return toast.error("Only PDF files are allowed!");
    }
    if (!jobDescription.trim()) return toast.error("Please enter a job description");

    setUploading(true);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset) {
        toast.error("Cloudinary configuration is missing in frontend .env");
        setUploading(false);
        return;
      }

      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
        method: 'POST',
        body: fd
      });
      
      const cloudData = await cloudRes.json();
      console.log("cloudData:",cloudData);
      if (!cloudRes.ok) {
        throw new Error(cloudData.error?.message || "Failed to upload resume to Cloudinary");
      }

      const payload = {
        resumeUrl: cloudData.secure_url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        cloudinaryPublicId: cloudData.public_id,
        job_description: jobDescription
      };

      const res = await uploadResumeAPI(payload);
      if (res?.data) {
        authStorage.setResumeAnalysis(user?._id || 'unknown', res.data);
      }
      toast.success("Resume analyzed successfully!");
      navigate('/candidate/dashboard');
    } catch (err) {
      toast.error(err?.message || "Analysis failed");
    } finally {
      setUploading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ATS Resume Analyzer</h1>
          <p className="text-gray-400">Get instant feedback on your resume's ATS compatibility</p>
        </div>

        <div className="p-12 bg-white/5 backdrop-blur border border-white/10 rounded-3xl text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-[#1f7af9]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
              <p className="text-gray-400 mb-8">Our AI will analyze your resume for ATS compatibility and provide actionable feedback</p>
              
          

              <label className="block border-2 border-dashed border-white/20 rounded-2xl p-12 hover:border-[#1f7af9]/50 transition-all cursor-pointer group">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-[#1f7af9] transition-colors" />
                <p className="text-lg mb-2">{file ? file.name : (uploading ? "Uploading..." : "Click to upload or drag and drop")}</p>
                <p className="text-sm text-gray-500">PDF ONLY (Max 5MB)</p>
                <input type="file" className="hidden" accept=".pdf,application/pdf" onChange={(e) => setFile(e.target.files?.[0])} disabled={uploading} />
              </label>

              <div className="my-6 text-left">
                <label className="block text-sm text-gray-400 mb-2">Target Job Description</label>
                <textarea 
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you want to match against..."
                  className="w-full px-4 py-3 bg-[#0f1723] border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] resize-none"
                />
              </div>

              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-bold hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all disabled:opacity-50"
              >
                {uploading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
