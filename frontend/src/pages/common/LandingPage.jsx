import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Target, TrendingUp, Users, ArrowRight, CheckCircle, 
  User, Briefcase, FileText, Calendar, Search, 
  MapPin, DollarSign, Clock, LayoutDashboard, Zap, Brain
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Footer from '../../components/component/Footer';
import Navbar from '../../components/component/Navbar';

// --- Visual Mockups ---

const ATSMockup = () => (
  <div className="bg-[#1a2332] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden h-full">
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1f7af9]/20 blur-3xl rounded-full" />
    <h4 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
      <FileText className="w-5 h-5 text-[#bc13fe]" /> Resume Analysis
    </h4>
    <div className="flex items-center gap-6 mb-6 relative z-10">
      <div className="relative w-24 h-24 flex shrink-0 items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.84)} className="text-[#10b981] transition-all duration-1000" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#10b981]">84%</span>
        </div>
      </div>
      <div>
        <p className="font-semibold text-lg leading-tight mb-1">Senior React Dev</p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#10b981]/10 text-[#10b981] text-xs font-semibold rounded-lg border border-[#10b981]/20">
          <CheckCircle className="w-3 h-3" /> Strong Match
        </div>
      </div>
    </div>
    <div className="space-y-4 relative z-10">
      <div>
        <p className="text-xs text-gray-400 mb-2">Matched Skills (8)</p>
        <div className="flex gap-2 flex-wrap">
          {['React', 'TypeScript', 'Node.js', 'Redux'].map(s => (
            <span key={s} className="px-2 py-1 text-[11px] bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] rounded-md">{s}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-2">Missing Skills (2)</p>
        <div className="flex gap-2 flex-wrap">
          {['GraphQL', 'AWS'].map(s => (
            <span key={s} className="px-2 py-1 text-[11px] bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] rounded-md">{s}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const JobCardMockup = () => (
  <div className="bg-[#1a2332] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-[#1f7af9]/50 transition-colors h-full flex flex-col">
    <div className="absolute top-4 right-4 bg-[#10b981]/20 text-[#10b981] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-[#10b981]/30">
      <Target className="w-3 h-3" /> 98% Match
    </div>
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 shrink-0 bg-white/5 rounded-xl flex items-center justify-center font-bold text-xl border border-white/10 text-[#1f7af9]">T</div>
      <div>
        <h4 className="font-bold text-lg leading-tight mb-1">Full Stack Engineer</h4>
        <p className="text-xs text-gray-400">TechNova Solutions</p>
      </div>
    </div>
    <div className="flex flex-col gap-2 text-xs text-gray-400 mb-4">
      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> Remote, US</div>
      <div className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5"/> $120k - $150k / yr</div>
    </div>
    <div className="flex gap-2 mb-6 flex-wrap">
      {['React', 'Python', 'PostgreSQL'].map(s => (
        <span key={s} className="px-2 py-1 text-[11px] bg-white/5 border border-white/10 rounded-md">{s}</span>
      ))}
    </div>
    <div className="mt-auto">
      <button className="w-full py-2.5 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold opacity-90 group-hover:opacity-100 transition-opacity text-sm shadow-lg shadow-[#1f7af9]/20 flex items-center justify-center gap-2">
        <Zap className="w-4 h-4" /> Quick Apply
      </button>
    </div>
  </div>
);

const ApplicationTrackerMockup = () => (
  <div className="bg-[#1a2332] p-6 rounded-2xl border border-white/10 shadow-2xl h-full flex flex-col">
    <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
      <Briefcase className="w-5 h-5 text-[#f59e0b]" /> Application Status
    </h4>
    <div className="space-y-5 relative flex-1">
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />
      {[
        { stage: 'Application Submitted', date: 'Oct 12', status: 'done' },
        { stage: 'ATS Resume Screening', date: 'Oct 13', status: 'done' },
        { stage: 'Technical Interview', date: 'Pending', status: 'active' },
        { stage: 'Final HR Round', date: 'Upcoming', status: 'upcoming' },
      ].map((step, idx) => (
        <div key={idx} className="flex items-start gap-4 relative z-10">
          <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center border-2 mt-0.5 ${
            step.status === 'done' ? 'bg-[#10b981] border-[#10b981]' :
            step.status === 'active' ? 'bg-[#1f7af9] border-[#1f7af9] animate-pulse' : 'bg-[#1a2332] border-white/20'
          }`}>
            {step.status === 'done' && <CheckCircle className="w-3 h-3 text-[#1a2332]" />}
            {step.status === 'active' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <div>
            <p className={`text-sm font-semibold leading-tight mb-0.5 ${step.status === 'active' ? 'text-[#1f7af9]' : step.status === 'done' ? 'text-white' : 'text-gray-500'}`}>
              {step.stage}
            </p>
            <p className="text-[11px] text-gray-500">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecruiterDashboardMockup = () => (
  <div className="bg-[#1a2332] rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-full flex flex-col">
    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-full flex items-center justify-center text-xs font-bold shadow-inner">R</div>
        <span className="font-semibold text-sm">Recruiter Workspace</span>
      </div>
      <button className="px-3 py-1.5 bg-[#1f7af9] rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-[#1f7af9]/90 transition-colors">
        <User className="w-3 h-3" /> Post Job
      </button>
    </div>
    <div className="p-5 flex-1">
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
          <p className="text-[11px] text-gray-400 mb-1">Open Positions</p>
          <p className="text-xl font-bold text-white">12</p>
        </div>
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
          <p className="text-[11px] text-gray-400 mb-1">Avg Hire Time</p>
          <p className="text-xl font-bold text-[#10b981]">-14%</p>
        </div>
      </div>
      <h5 className="text-xs font-semibold mb-3 text-gray-300">Top Pipeline (Frontend Dev)</h5>
      <div className="space-y-2.5">
        {[
          { name: 'Alex Johnson', match: '96%', exp: '5 yrs' },
          { name: 'Sarah Chen', match: '92%', exp: '4 yrs' }
        ].map(c => (
          <div key={c.name} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-[#1f7af9]/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs font-medium">{c.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-semibold group-hover:text-[#1f7af9] transition-colors">{c.name}</p>
                <p className="text-[10px] text-gray-400">{c.exp} exp</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-md">{c.match} Match</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CandidateProfileMockup = () => (
  <div className="bg-[#1a2332] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-xl flex items-center justify-center text-xl font-bold">AJ</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-lg truncate">Alex Johnson</h4>
        <p className="text-[11px] text-gray-400 truncate">Applied 2h ago</p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold rounded-md border border-[#10b981]/20">
          <Target className="w-3 h-3" /> 96% JD Match
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button className="flex items-center justify-center gap-1.5 py-2 bg-[#1f7af9] rounded-lg text-xs font-semibold shadow-lg shadow-[#1f7af9]/20 hover:bg-[#1f7af9]/90 transition-colors">
        <Calendar className="w-3.5 h-3.5" /> Schedule
      </button>
      <button className="flex items-center justify-center gap-1.5 py-2 bg-white/10 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors">
        <User className="w-3.5 h-3.5" /> Full Profile
      </button>
    </div>

    <div className="space-y-3 mt-auto">
      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/20 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#bc13fe]" />
          <div>
            <p className="text-sm font-semibold">Resume.pdf</p>
            <p className="text-[10px] text-gray-500">2.4 MB</p>
          </div>
        </div>
        <button className="text-[#1f7af9] text-xs hover:underline font-medium">View</button>
      </div>
    </div>
  </div>
);


export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' or 'recruiter'

  const stats = [
    { value: '1.2M+', label: 'Jobs Matched', icon: Target },
    { value: '45%', label: 'Higher Interview Rate', icon: TrendingUp },
    { value: '60%', label: 'Faster Hiring Time', icon: Clock },
    { value: '98%', label: 'AI Match Accuracy', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-[#0f1723] text-white selection:bg-[#1f7af9]/30">
      {/* Navbar */}
    <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1f7af9]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1f7af9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f7af9]"></span>
              </span>
              <span className="text-sm font-medium">The New Standard in AI Recruitment</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Where Talent Meets <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] bg-clip-text text-transparent">
                True Intelligence
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the platform that actually understands resumes and job requirements.
              Precise ATS scoring for candidates, and powerful AI matching for recruiters.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => {
                setActiveTab('candidate');
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-bold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center justify-center gap-2 group">
                For Candidates
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => {
                setActiveTab('recruiter');
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
                For Recruiters
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Mockup Preview Grid */}
        <div className="max-w-6xl mx-auto mt-20 relative hidden md:block">
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0f1723] to-transparent z-20 pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 opacity-60 scale-95"
          >
            <div className="transform translate-y-12 blur-[1px] hover:blur-none transition-all duration-500">
              <RecruiterDashboardMockup />
            </div>
            <div className="transform -translate-y-4 z-10 scale-105 shadow-[0_0_100px_rgba(31,122,249,0.2)]">
              <ATSMockup />
            </div>
            <div className="transform translate-y-8 blur-[1px] hover:blur-none transition-all duration-500">
              <CandidateProfileMockup />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-[#1a2332]/50 relative z-30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#1f7af9]/10 rounded-xl">
                    <stat.icon className="w-6 h-6 text-[#1f7af9]" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black mb-1 text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Features Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-[#0f1723] to-[#1a2332]">
        <div className="max-w-7xl mx-auto">
          
          {/* Tab Selector */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 relative shadow-xl">
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl transition-all duration-300 ease-out shadow-md
                  ${activeTab === 'recruiter' ? 'translate-x-full' : 'translate-x-0'}
                `}
              />
              <button 
                onClick={() => setActiveTab('candidate')}
                className={`relative z-10 px-8 py-3 text-sm md:text-base font-bold rounded-xl transition-colors duration-300 w-40 md:w-48 ${
                  activeTab === 'candidate' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                For Candidates
              </button>
              <button 
                onClick={() => setActiveTab('recruiter')}
                className={`relative z-10 px-8 py-3 text-sm md:text-base font-bold rounded-xl transition-colors duration-300 w-40 md:w-48 ${
                  activeTab === 'recruiter' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                For Recruiters
              </button>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'candidate' ? (
                <motion.div 
                  key="candidate-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Master Your Job Search Journey</h2>
                    <p className="text-gray-400 text-lg">Stop guessing what recruiters want. Our AI analyzes your resume against actual job descriptions and guides your application process end-to-end.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="flex flex-col gap-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-[#bc13fe]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#bc13fe]/20">
                          <Target className="w-6 h-6 text-[#bc13fe]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Deep ATS Analysis</h3>
                        <p className="text-gray-400 text-sm">Upload your resume and a target job description. Get a precise match score, skill gap analysis, and actionable improvements instantly.</p>
                      </div>
                      <div className="flex-1 min-h-[300px]">
                        <ATSMockup />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#10b981]/20">
                          <Search className="w-6 h-6 text-[#10b981]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Smart Job Matching</h3>
                        <p className="text-gray-400 text-sm">Discover roles curated specifically for your skill profile. Apply with one click when your ATS match score is in the green.</p>
                      </div>
                      <div className="flex-1 min-h-[300px]">
                        <JobCardMockup />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-[#f59e0b]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#f59e0b]/20">
                          <LayoutDashboard className="w-6 h-6 text-[#f59e0b]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Application Tracking</h3>
                        <p className="text-gray-400 text-sm">Say goodbye to spreadsheets. Track every application automatically from submission to the final HR round.</p>
                      </div>
                      <div className="flex-1 min-h-[300px]">
                        <ApplicationTrackerMockup />
                      </div>
                    </div>
                  </div>

                  {/* How it works simple flow */}
                  <div className="mt-20 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                    <h3 className="text-2xl font-bold text-center mb-10">How it Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                      <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      {[
                        { title: "Upload Profile", desc: "Add your latest PDF resume", icon: FileText },
                        { title: "AI Analysis", desc: "Get scored against JD", icon: Brain },
                        { title: "Match Jobs", desc: "Find high-probability roles", icon: Sparkles },
                        { title: "One-Click Apply", desc: "Track progress easily", icon: Zap }
                      ].map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-[#1a2332] rounded-full flex items-center justify-center border-2 border-[#1f7af9]/50 mb-4 shadow-[0_0_20px_rgba(31,122,249,0.2)]">
                            <step.icon className="w-5 h-5 text-[#1f7af9]" />
                          </div>
                          <h4 className="font-bold mb-2">{step.title}</h4>
                          <p className="text-xs text-gray-400">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="recruiter-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Hire Top Talent Faster</h2>
                    <p className="text-gray-400 text-lg">Cut through the noise. Our AI ranks applicants instantly based on real skill requirements, letting you focus on engaging the best candidates.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="flex flex-col gap-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-[#1f7af9]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#1f7af9]/20">
                          <LayoutDashboard className="w-6 h-6 text-[#1f7af9]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Command Center Dashboard</h3>
                        <p className="text-gray-400 text-sm">Get a bird's-eye view of your entire hiring pipeline. Track open positions, monitor time-to-hire trends, and instantly spot top-tier candidates surfaced by AI.</p>
                      </div>
                      <div className="flex-1 min-h-[320px]">
                        <RecruiterDashboardMockup />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-[#bc13fe]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#bc13fe]/20">
                          <Users className="w-6 h-6 text-[#bc13fe]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Rich Candidate Profiles</h3>
                        <p className="text-gray-400 text-sm">Everything you need in one view. Analyze AI-verified match scores, preview uploaded resumes instantly, and schedule interviews with one click.</p>
                      </div>
                      <div className="flex-1 min-h-[320px]">
                        <CandidateProfileMockup />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 md:p-16 bg-gradient-to-br from-[#1f7af9]/10 to-[#bc13fe]/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#bc13fe]/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1f7af9]/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Experience <br/> the Future of Hiring?</h2>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                Join thousands of candidates landing their dream jobs and recruiters building world-class teams with HireSense AI.
              </p>
              
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => navigate('/role-selection')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-bold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all text-lg">
                    Create Free Account
                  </button>
                  <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-lg">
                    Sign In
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard')} 
                  className="px-8 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-bold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all text-lg flex items-center mx-auto gap-2 group"
                >
                  Return to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
