import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/slices/authSlice';
import { motion } from 'motion/react';
import { UserCircle, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function RoleSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tempSignupData, loading, error } = useSelector((state) => state.auth);

  const handleRoleSelection = async (role) => {
    if (!tempSignupData) {
      toast.error("No signup data found. Please register first.");
      navigate('/register');
      return;
    }
    
    // Add the selected role to the signup data (map candidate to user)
    const apiRole = role.id === 'candidate' ? 'user' : role.id;
    const userData = { ...tempSignupData, role: apiRole };
    
    try {
      const resultAction = await dispatch(signupUser(userData)).unwrap();
      // On success, redirect to the corresponding path
      navigate(role.path);
    } catch (err) {
      toast.error(err || "Signup failed");
    }
  };

  const roles = [{
    id: 'candidate',
    title: "I'm a Candidate",
    description: 'Find your dream job, improve your resume, and ace interviews with AI guidance',
    icon: UserCircle,
    color: 'from-[#1f7af9] to-[#0d5ecf]',
    path: '/onboarding'
  }, {
    id: 'recruiter',
    title: "I'm a Recruiter",
    description: 'Streamline hiring, find top talent, and make data-driven recruitment decisions',
    icon: Building2,
    color: 'from-[#bc13fe] to-[#8a0ebd]',
    path: '/recruiter/dashboard'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#1f7af9]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-[#bc13fe]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-5xl">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Choose Your Path</h1>
          <p className="text-xl text-gray-400">Select how you want to use HireSense AI</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {error && <div className="col-span-2 text-red-500 text-center mb-4">{error}</div>}
          {roles.map((role, index) => <motion.button key={role.id} disabled={loading} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => handleRoleSelection(role)} className="group relative p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-white/30 transition-all text-left overflow-hidden disabled:opacity-50">
              <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <role.icon className="w-8 h-8" />
                </div>

                <h2 className="text-3xl font-bold mb-3">{role.title}</h2>
                <p className="text-gray-400 mb-6">{role.description}</p>

                <div className="flex items-center gap-2 text-[#1f7af9] font-semibold">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${role.color} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
            </motion.button>)}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          You can always switch your role later in settings
        </p>
      </div>
    </div>;
}
