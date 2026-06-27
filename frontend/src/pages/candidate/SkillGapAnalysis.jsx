import { useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink, BookOpen, Award } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
export function SkillGapAnalysis() {
  const navigate = useNavigate();
  const radarData = [{
    skill: 'React',
    required: 90,
    yours: 95
  }, {
    skill: 'TypeScript',
    required: 85,
    yours: 75
  }, {
    skill: 'Node.js',
    required: 75,
    yours: 80
  }, {
    skill: 'AWS',
    required: 70,
    yours: 50
  }, {
    skill: 'Testing',
    required: 80,
    yours: 65
  }, {
    skill: 'Design',
    required: 60,
    yours: 70
  }];
  const skillsGap = [{
    name: 'TypeScript',
    gap: 10,
    level: 'Advanced'
  }, {
    name: 'AWS',
    gap: 20,
    level: 'Intermediate'
  }, {
    name: 'Testing',
    gap: 15,
    level: 'Intermediate'
  }];
  const recommendations = [{
    skill: 'TypeScript',
    course: 'TypeScript Deep Dive',
    platform: 'Udemy',
    duration: '8 hours',
    rating: 4.8,
    link: '#'
  }, {
    skill: 'AWS',
    course: 'AWS Certified Developer Course',
    platform: 'A Cloud Guru',
    duration: '24 hours',
    rating: 4.9,
    link: '#'
  }, {
    skill: 'Testing',
    course: 'JavaScript Testing Masterclass',
    platform: 'Frontend Masters',
    duration: '6 hours',
    rating: 4.7,
    link: '#'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Skill Gap Analysis</h1>
          <p className="text-gray-400">Identify areas for improvement and get personalized learning paths</p>
        </div>

        {/* Skills Radar Chart */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <h2 className="text-2xl font-bold mb-6">Skills Overview</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="skill" stroke="#8b92a8" />
                  <PolarRadiusAxis stroke="#8b92a8" />
                  <Radar name="Required" dataKey="required" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  <Radar name="Your Level" dataKey="yours" stroke="#1f7af9" fill="#1f7af9" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-[#10b981]" />
                    <span className="font-semibold">Strong Skills</span>
                  </div>
                  <p className="text-sm text-gray-400">React, Node.js, Design</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-[#f59e0b]" />
                    <span className="font-semibold">Skills to Improve</span>
                  </div>
                  <p className="text-sm text-gray-400">TypeScript, AWS, Testing</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-3xl font-bold mb-1">91%</div>
                  <p className="text-sm text-gray-400">Overall Skill Alignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gap Comparison */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <h3 className="text-2xl font-bold mb-6">Skill Gap Breakdown</h3>
          <div className="space-y-4">
            {radarData.map(skill => {
            const gap = skill.required - skill.yours;
            const hasGap = gap > 0;
            return <div key={skill.skill} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{skill.skill}</span>
                    <span className={`text-sm ${hasGap ? 'text-[#f59e0b]' : 'text-[#10b981]'}`}>
                      {hasGap ? `${gap} points gap` : 'Exceeds requirement'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Required Level</p>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#f59e0b]" style={{
                      width: `${skill.required}%`
                    }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{skill.required}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Your Level</p>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1f7af9]" style={{
                      width: `${skill.yours}%`
                    }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{skill.yours}%</p>
                    </div>
                  </div>
                </div>;
          })}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6">Recommended Learning Resources</h3>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => <div key={idx} className="p-5 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded text-xs font-semibold text-[#1f7af9]">
                        {rec.skill}
                      </span>
                      <span className="text-xs text-gray-500">{rec.platform}</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{rec.course}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{rec.duration}</span>
                      <span className="flex items-center gap-1">
                        ⭐ {rec.rating}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all flex items-center gap-2">
                    View Course
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
