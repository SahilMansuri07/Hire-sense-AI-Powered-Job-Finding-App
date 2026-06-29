import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Video, Mic, Camera, ArrowRight, Briefcase, Code, Users } from 'lucide-react';
export function InterviewSetup() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    jobRole: 'Senior Frontend Developer',
    interviewType: 'behavioral',
    difficulty: 'medium',
    cameraEnabled: true,
    micEnabled: true
  });
  const interviewTypes = [{
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Questions about your experience and soft skills',
    icon: Users,
    color: 'from-[#1f7af9] to-[#0d5ecf]'
  }, {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Coding challenges and system design questions',
    icon: Code,
    color: 'from-[#bc13fe] to-[#8a0ebd]'
  }, {
    id: 'hr',
    title: 'HR Screening',
    description: 'General questions about your background and expectations',
    icon: Briefcase,
    color: 'from-[#10b981] to-[#059669]'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Mock Interview Setup</h1>
        <p className="text-gray-400">Configure your practice interview session</p>
      </div>

      <div className="space-y-6">
        {/* Job Role */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <label className="block text-lg font-semibold mb-3">Job Role</label>
          <input type="text" value={config.jobRole} onChange={e => setConfig({
            ...config,
            jobRole: e.target.value
          })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" placeholder="e.g., Senior Frontend Developer" />
        </div>

        {/* Interview Type */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <label className="block text-lg font-semibold mb-4">Interview Type</label>
          <div className="grid md:grid-cols-3 gap-4">
            {interviewTypes.map(type => <button key={type.id} onClick={() => setConfig({
              ...config,
              interviewType: type.id
            })} className={`p-5 rounded-xl border-2 transition-all text-left ${config.interviewType === type.id ? 'border-[#1f7af9] bg-gradient-to-br from-[#1f7af9]/20 to-[#1f7af9]/5' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
              <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-3`}>
                <type.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1">{type.title}</h3>
              <p className="text-sm text-gray-400">{type.description}</p>
            </button>)}
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <label className="block text-lg font-semibold mb-4">Difficulty Level</label>
          <div className="flex gap-3">
            {['easy', 'medium', 'hard'].map(level => <button key={level} onClick={() => setConfig({
              ...config,
              difficulty: level
            })} className={`flex-1 px-6 py-3 rounded-xl border transition-all ${config.difficulty === level ? 'border-[#1f7af9] bg-[#1f7af9]/20 text-white' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>)}
          </div>
        </div>

        {/* Device Check */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Device Check</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1f7af9]/20 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[#1f7af9]" />
                  </div>
                  <span className="font-semibold">Camera</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={config.cameraEnabled} onChange={e => setConfig({
                    ...config,
                    cameraEnabled: e.target.checked
                  })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f7af9]" />
                </label>
              </div>
              <div className="h-32 bg-black/50 rounded-lg flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-600" />
              </div>
            </div>

            <div className="p-5 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#bc13fe]/20 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5 text-[#bc13fe]" />
                  </div>
                  <span className="font-semibold">Microphone</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={config.micEnabled} onChange={e => setConfig({
                    ...config,
                    micEnabled: e.target.checked
                  })} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#bc13fe]" />
                </label>
              </div>
              <div className="h-32 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-2 bg-[#10b981] rounded-full animate-pulse" style={{
                    height: `${(i + 1) * 8}px`,
                    animationDelay: `${i * 100}ms`
                  }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button onClick={() => navigate('/candidate/interview-live')} className="w-full py-5 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-2xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center justify-center gap-3 text-lg">
          Start Interview
          <ArrowRight className="w-6 h-6" />
        </button>

        <p className="text-center text-sm text-gray-500">
          Your interview will be recorded for AI analysis. You can review the full transcript and feedback after completion.
        </p>
      </div>
    </div>
  </div>;
}
