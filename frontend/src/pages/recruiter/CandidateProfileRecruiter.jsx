import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Mail, MapPin, Briefcase, Calendar, FileText, Star, MessageSquare, Download } from 'lucide-react';
import { fetchCandidateProfileAPI } from '../../api/recruiterJobsApi';
import { formatDistanceToNow, format } from 'date-fns';

export function CandidateProfileRecruiter() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                  <p className="text-xl text-gray-400 mb-4">{profile.title}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Briefcase className="w-4 h-4" />
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
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Shortlist
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
