import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, MapPin, Briefcase, Calendar, Award, FileText, Video, Star, MessageSquare, CheckCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
export function CandidateProfileRecruiter() {
  const navigate = useNavigate();
  const skillsComparison = [{
    skill: 'React',
    required: 90,
    candidate: 95
  }, {
    skill: 'TypeScript',
    required: 85,
    candidate: 88
  }, {
    skill: 'Node.js',
    required: 75,
    candidate: 82
  }, {
    skill: 'AWS',
    required: 70,
    candidate: 65
  }, {
    skill: 'Testing',
    required: 80,
    candidate: 78
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Profile Header with AI Match Score */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-2xl flex items-center justify-center text-6xl flex-shrink-0">
              👩
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Sarah Chen</h1>
                  <p className="text-xl text-gray-400 mb-4">Senior Frontend Developer</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      sarah.chen@email.com
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      8 years experience
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Applied 3 days ago
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mb-2 border-4 border-[#10b981]/30">
                    <span className="text-4xl font-black">96</span>
                  </div>
                  <p className="text-sm text-gray-400">AI Match</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate('/recruiter/scheduler')} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                  Schedule Interview
                </button>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Shortlist
                </button>
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Skills Comparison */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Skills vs Job Requirements</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsComparison}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="skill" stroke="#8b92a8" />
                  <PolarRadiusAxis stroke="#8b92a8" />
                  <Radar name="Required" dataKey="required" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  <Radar name="Candidate" dataKey="candidate" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Strong Match</p>
                <p className="text-sm">React, TypeScript, Node.js</p>
              </div>
              <div className="p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Minor Gaps</p>
                <p className="text-sm">AWS, Testing</p>
              </div>
            </div>
          </div>

          {/* AI Interview Analysis */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Video className="w-6 h-6 text-[#bc13fe]" />
              <h3 className="text-2xl font-bold">AI Interview Analysis</h3>
            </div>
            <div className="aspect-video bg-black/50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-full flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <button className="absolute inset-0 flex items-center justify-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                </div>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Interview Score</span>
                <span className="text-xl font-bold text-[#10b981]">92/100</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Confidence Level</span>
                <span className="text-xl font-bold text-[#1f7af9]">88%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Communication</span>
                <span className="text-xl font-bold text-[#bc13fe]">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resume & Documents */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-[#1f7af9]" />
              <h3 className="text-2xl font-bold">Resume & Documents</h3>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">resume_sarah_chen.pdf</span>
                  <span className="px-3 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-sm">
                    94% ATS
                  </span>
                </div>
                <p className="text-sm text-gray-400">2.4 MB • Updated Apr 18, 2026</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 transition-all cursor-pointer">
                <span className="font-semibold">portfolio_website.pdf</span>
                <p className="text-sm text-gray-400 mt-1">1.8 MB • Uploaded Apr 18, 2026</p>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                Download All Documents
              </button>
            </div>
          </div>

          {/* Recruiter Notes & Actions */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Recruiter Notes</h3>
            <textarea placeholder="Add your notes about this candidate..." className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none mb-4" />
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  <span className="text-sm font-semibold">Strong technical background</span>
                </div>
                <p className="text-xs text-gray-400">Added by John D. on Apr 20</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  <span className="text-sm font-semibold">Great culture fit</span>
                </div>
                <p className="text-xs text-gray-400">Added by Jane S. on Apr 21</p>
              </div>
            </div>
            <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>;
}
