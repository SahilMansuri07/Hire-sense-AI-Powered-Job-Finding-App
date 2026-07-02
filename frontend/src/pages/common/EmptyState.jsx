import { useNavigate } from 'react-router';
import { Video, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
export function EmptyState() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-[#0f1723] text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        duration: 0.5,
        type: 'spring'
      }} className="relative mb-8">
          {/* Floating elements */}
          <motion.div animate={{
          y: [0, -20, 0]
        }} transition={{
          duration: 3,  
          repeat: Infinity,
          ease: 'easeInOut'
        }} className="absolute -top-8 -left-8 w-16 h-16 bg-[#1f7af9]/20 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#1f7af9]" />
          </motion.div>

          <motion.div animate={{
          y: [0, 20, 0]
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }} className="absolute -top-4 -right-12 w-12 h-12 bg-[#bc13fe]/20 rounded-xl flex items-center justify-center">
            <Video className="w-6 h-6 text-[#bc13fe]" />
          </motion.div>

          {/* Main illustration */}
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1f7af9]/10 to-[#bc13fe]/10 animate-pulse" />
            <div className="relative z-10 text-8xl">🎯</div>
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
          <h1 className="text-4xl font-black mb-4">No Interviews Yet</h1>
          <p className="text-xl text-gray-400 mb-8">
            Start your journey by taking a mock interview and get AI-powered feedback to improve your skills
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => navigate('/candidate/interview-setup')} className="px-8 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center justify-center gap-2 group">
              Start Your First Interview
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/candidate/jobs')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              Browse Jobs
            </button>
          </div>

          {/* Tips */}
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="p-5 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
              <div className="w-10 h-10 bg-[#1f7af9]/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold mb-2">Practice Makes Perfect</h3>
              <p className="text-sm text-gray-400">
                Take mock interviews to build confidence and improve your performance
              </p>
            </div>

            <div className="p-5 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
              <div className="w-10 h-10 bg-[#bc13fe]/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold mb-2">Track Your Progress</h3>
              <p className="text-sm text-gray-400">
                Get detailed analytics and feedback on every interview session
              </p>
            </div>

            <div className="p-5 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
              <div className="w-10 h-10 bg-[#10b981]/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Land Your Dream Job</h3>
              <p className="text-sm text-gray-400">
                Use AI insights to optimize your resume and interview skills
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
}
