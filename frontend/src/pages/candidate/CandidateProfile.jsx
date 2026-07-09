import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, MapPin, Briefcase, Calendar, Award, FileText, Video } from 'lucide-react';
import { useSelector } from 'react-redux';
import { authStorage } from '../../utils/authStorage';

export function CandidateProfile() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const skills = user?.skills || [];
  const resumeAnalysis = authStorage.getResumeAnalysis(user?._id || user?.id);
  const atsScore = resumeAnalysis?.["JD Match"] || resumeAnalysis?.["jd_match"] || resumeAnalysis?.["ats_score"] || 0;
  const resumeName = user?.name ? `${user.name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf` : 'resume.pdf';
  const interviews = [{
    company: 'TechCorp',
    role: 'Senior Frontend Dev',
    date: 'Apr 15, 2026',
    score: 87
  }, {
    company: 'StartupXYZ',
    role: 'Full Stack Engineer',
    date: 'Apr 8, 2026',
    score: 92
  }, {
    company: 'DataSolutions',
    role: 'React Developer',
    date: 'Apr 1, 2026',
    score: 78
  }];
  const activity = [{
    type: 'interview',
    text: 'Completed mock interview for TechCorp',
    date: '2 days ago'
  }, {
    type: 'resume',
    text: 'Updated resume - ATS score improved to 84',
    date: '5 days ago'
  }, {
    type: 'job',
    text: 'Applied to 3 new positions',
    date: '1 week ago'
  }, {
    type: 'skill',
    text: 'Completed TypeScript course',
    date: '2 weeks ago'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-2xl flex items-center justify-center text-6xl flex-shrink-0 font-bold text-white">
              {user?.name?.charAt(0) || user?.first_name?.charAt(0) || '👤'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user?.name || user?.first_name || 'Candidate Name'}</h1>
              <p className="text-xl text-gray-400 mb-4">{user?.jobRole?.jobRoleId?.name || user?.jobRole?.name || 'Professional Candidate'}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  {user?.email || 'candidate@email.com'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {user?.location || 'Open to Relocation'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  {user?.jobRole?.experienceLevel || 'Ready for opportunities'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Active Member
                </div>
              </div>
              <button onClick={() => navigate('/settings')} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Skills */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-[#1f7af9]" />
              <h2 className="text-2xl font-bold">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => <span key={skill} className="px-4 py-2 bg-gradient-to-r from-[#1f7af9]/20 to-[#bc13fe]/20 border border-[#1f7af9]/50 rounded-lg">
                  {skill}
                </span>)}
            </div>
          </div>

          {/* Resume */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-[#bc13fe]" />
              <h2 className="text-2xl font-bold">Resume</h2>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{resumeName}</span>
                <span className="px-3 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-sm">
                  {atsScore}% ATS
                </span>
              </div>
              <p className="text-sm text-gray-400">Updated 5 days ago</p>
            </div>
            <button onClick={() => navigate(`/candidate/ats-analyzer`)} className="w-full py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              Upload New Resume
            </button>
          </div>
        </div>

        {/* Interview History */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Video className="w-6 h-6 text-[#10b981]" />
            <h2 className="text-2xl font-bold">Interview History</h2>
          </div>
          <div className="space-y-3">
            {interviews.map((interview, idx) => <div key={idx} className="p-5 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-lg">{interview.company}</span>
                      <span className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded text-[#1f7af9] text-sm">
                        {interview.score}/100
                      </span>
                    </div>
                    <p className="text-gray-400">{interview.role}</p>
                    <p className="text-sm text-gray-500 mt-1">{interview.date}</p>
                  </div>
                  <button onClick={() => navigate('/candidate/interview-results/1')} className="px-4 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                    View Results
                  </button>
                </div>
              </div>)}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Activity Timeline</h2>
          <div className="space-y-4">
            {activity.map((item, idx) => <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#1f7af9]/20 rounded-full flex items-center justify-center">
                    {item.type === 'interview' && <Video className="w-5 h-5 text-[#1f7af9]" />}
                    {item.type === 'resume' && <FileText className="w-5 h-5 text-[#bc13fe]" />}
                    {item.type === 'job' && <Briefcase className="w-5 h-5 text-[#10b981]" />}
                    {item.type === 'skill' && <Award className="w-5 h-5 text-[#f59e0b]" />}
                  </div>
                  {idx < activity.length - 1 && <div className="w-0.5 flex-1 bg-white/10 mt-2" />}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-semibold mb-1">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
