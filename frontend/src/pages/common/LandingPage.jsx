import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Target, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';
export function LandingPage() {
  const navigate = useNavigate();
  const stats = [{
    value: '98%',
    label: 'Match Accuracy',
    icon: Target
  }, {
    value: '10M+',
    label: 'Interviews Analyzed',
    icon: Sparkles
  }, {
    value: '50K+',
    label: 'Active Users',
    icon: Users
  }, {
    value: '3x',
    label: 'Faster Hiring',
    icon: TrendingUp
  }];
  const features = [{
    title: 'ATS Score Analysis',
    description: 'Get instant feedback on your resume with AI-powered ATS compatibility scoring'
  }, {
    title: 'AI Mock Interviews',
    description: 'Practice with our AI interviewer and receive real-time feedback on your performance'
  }, {
    title: 'Skill Gap Roadmaps',
    description: 'Personalized learning paths to bridge the gap between your skills and dream job'
  }, {
    title: 'Smart Matching',
    description: 'AI-driven candidate-job matching for recruiters with 98% accuracy'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0f1723]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">HireSense AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm hover:text-[#1f7af9] transition-colors">
              Log In
            </button>
            <button onClick={() => navigate('/register')} className="px-6 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="inline-block px-4 py-2 bg-[#1f7af9]/10 border border-[#1f7af9]/30 rounded-full mb-6">
              <span className="text-[#1f7af9]">Powered by Advanced AI</span>
            </div>
            <h1 className="text-6xl font-black mb-6 leading-tight">
              AI-Powered Resume &<br />
              <span className="bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] bg-clip-text text-transparent">
                Interview Intelligence
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform your hiring process with AI-driven insights. Score resumes, conduct mock interviews, and find the perfect match.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => navigate('/role-selection')} className="px-8 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/role-selection')} className="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all">
                <stat.icon className="w-8 h-8 text-[#1f7af9] mb-3 mx-auto" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#1a2332]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-400">Powerful AI tools for both candidates and recruiters</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all group">
                <CheckCircle className="w-10 h-10 text-[#1f7af9] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 backdrop-blur border border-white/10 rounded-3xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-gray-400 mb-8">Join thousands of professionals using HireSense AI</p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => navigate('/role-selection')} className="px-8 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all">
                I'm a Candidate
              </button>
              <button onClick={() => navigate('/role-selection')} className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all">
                I'm a Recruiter
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>;
}
