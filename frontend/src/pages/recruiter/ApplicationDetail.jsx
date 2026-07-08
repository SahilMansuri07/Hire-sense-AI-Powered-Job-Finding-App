import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Mail, MapPin, Briefcase, Calendar, FileText, Star, MessageSquare, Download, Phone, CheckCircle2 } from 'lucide-react';
import { fetchCandidateProfileAPI, updateCandidateStatusAPI } from '../../api/recruiterJobsApi';
import { formatDistanceToNow, format } from 'date-fns';

export function ApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await updateCandidateStatusAPI(id, newStatus);
      if (response?.data) {
        setProfile(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetchCandidateProfileAPI(id);
        if (response?.data) {
          setProfile(response.data);
        } else {
          setError("Candidate not found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch candidate profile.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getProfile();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0f1723] text-white flex items-center justify-center">Loading...</div>;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0f1723] text-white flex flex-col items-center justify-center">
        <p className="text-xl mb-4 text-red-400">{error || "Profile not found."}</p>
        <button onClick={() => navigate('/recruiter/dashboard')} className="text-[#1f7af9] hover:underline">
          Go back to dashboard
        </button>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-2xl flex items-center justify-center text-6xl flex-shrink-0">
              🧑‍💻
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    {profile.name}
                    <span className="px-3 py-1 text-xs font-semibold bg-white/10 text-white rounded-full border border-white/20 uppercase">
                      {profile.status}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-4">{profile.title}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {profile.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      {profile.yearsOfExperience} years experience
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Applied {profile.appliedDate ? formatDistanceToNow(new Date(profile.appliedDate), { addSuffix: true }) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleStatusUpdate('shortlisted')}
                  disabled={updating || profile.status === 'shortlisted'}
                  className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${profile.status === 'shortlisted' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 cursor-not-allowed' : 'bg-white/5 border border-white/10 hover:bg-[#10b981]/10 hover:text-[#10b981] hover:border-[#10b981]/30'}`}
                >
                  <Star className="w-5 h-5" />
                  {profile.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                </button>
                <button 
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updating || profile.status === 'rejected'}
                  className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${profile.status === 'rejected' ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 cursor-not-allowed' : 'bg-white/5 border border-white/10 hover:bg-[#ef4444]/10 hover:text-[#ef4444] hover:border-[#ef4444]/30'}`}
                >
                  {profile.status === 'rejected' ? 'Rejected' : 'Reject'}
                </button>
                <button 
                  disabled
                  title="This feature will be available soon."
                  className="px-6 py-3 bg-gray-600/30 text-gray-400 rounded-xl cursor-not-allowed border border-gray-600/50 flex items-center gap-2 transition-all"
                >
                  Schedule Interview
                </button>
                <button 
                  disabled
                  title="This feature will be available soon."
                  className="px-6 py-3 bg-gray-600/30 text-gray-400 rounded-xl cursor-not-allowed border border-gray-600/50 flex items-center gap-2 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        {profile.jobDetails && (
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#bc13fe]" />
              Applied Position Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Role</p>
                <p className="font-semibold text-sm">{profile.jobDetails.jobTitle || 'N/A'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Department</p>
                <p className="font-semibold text-sm">{profile.jobDetails.department || 'N/A'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Experience required</p>
                <p className="font-semibold text-sm">{profile.jobDetails.experienceLevel || 'N/A'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Salary Range</p>
                <p className="font-semibold text-sm text-[#10b981]">
                  {profile.jobDetails.salaryRange?.min ? `$${profile.jobDetails.salaryRange.min.toLocaleString()}` : ''}
                  {profile.jobDetails.salaryRange?.max ? ` - $${profile.jobDetails.salaryRange.max.toLocaleString()}` : ''}
                  {!profile.jobDetails.salaryRange?.min && !profile.jobDetails.salaryRange?.max && 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Match Metrics Section */}
        {profile.matchMetrics && Object.keys(profile.matchMetrics).length > 0 && (
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-[#f59e0b]" />
                ATS Match Analysis
              </h3>
              <div className="px-4 py-2 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-lg flex items-center gap-2">
                 <span className="text-sm text-gray-400">Overall Match</span>
                 <span className="text-xl font-bold text-[#10b981]">{profile.matchMetrics.match_score || profile.matchMetrics["JD Match"] || profile.matchMetrics.skill_match_score || 0}%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#10b981]/5 rounded-2xl border border-[#10b981]/20">
                <h4 className="text-sm font-semibold text-[#10b981] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(profile.matchMetrics.matched_keywords || profile.matchMetrics["Matched Keywords"] || []).map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded-lg text-sm border border-[#10b981]/20">
                      {kw}
                    </span>
                  ))}
                  {!(profile.matchMetrics.matched_keywords || profile.matchMetrics["Matched Keywords"])?.length && (
                    <span className="text-sm text-gray-500">No matched keywords found</span>
                  )}
                </div>
              </div>

              <div className="p-5 bg-[#ef4444]/5 rounded-2xl border border-[#ef4444]/20">
                <h4 className="text-sm font-semibold text-[#ef4444] uppercase tracking-wider mb-4 flex items-center gap-2">
                   Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(profile.matchMetrics.missing_keywords || profile.matchMetrics["Missing Keywords"] || []).map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#ef4444]/10 text-[#ef4444] rounded-lg text-sm border border-[#ef4444]/20 line-through decoration-[#ef4444]/50">
                      {kw}
                    </span>
                  ))}
                  {!(profile.matchMetrics.missing_keywords || profile.matchMetrics["Missing Keywords"])?.length && (
                    <span className="text-sm text-gray-500">No missing keywords found</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume & Documents */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-[#1f7af9]" />
            <h3 className="text-2xl font-bold">Resume & Documents</h3>
          </div>
          <div className="space-y-3">
            {profile.resume && (
              <a 
                href={profile.resume.downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white group-hover:text-[#1f7af9] transition-colors">{profile.resume.fileName}</span>
                  <span className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded text-[#1f7af9] text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" /> PDF
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {formatFileSize(profile.resume.fileSize)} • Updated {profile.resume.uploadDate ? format(new Date(profile.resume.uploadDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </a>
            )}
            
            {profile.otherDocuments && profile.otherDocuments.map((doc, idx) => (
              <a
                key={idx}
                href={doc.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white group-hover:text-[#1f7af9] transition-colors">{doc.fileName}</span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 rounded text-gray-300 text-sm flex items-center gap-1">
                    <Download className="w-4 h-4" /> {doc.fileType}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Attached Document</p>
              </a>
            ))}

            {!profile.resume && (!profile.otherDocuments || profile.otherDocuments.length === 0) && (
              <p className="text-gray-400 italic">No documents attached.</p>
            )}

            {(profile.resume || (profile.otherDocuments && profile.otherDocuments.length > 0)) && (
               <button 
                 onClick={() => {
                   if (profile.resume) window.open(profile.resume.downloadLink, '_blank');
                   profile.otherDocuments?.forEach(doc => {
                     window.open(doc.downloadLink, '_blank');
                   });
                 }}
                 className="w-full mt-4 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all text-white font-medium flex items-center justify-center gap-2"
               >
                 <Download className="w-5 h-5" /> Download All Documents
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
