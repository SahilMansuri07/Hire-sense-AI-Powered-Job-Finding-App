import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setTempSignupData, validateUser } from '../../redux/slices/authSlice';
import { Mail, Lock, User, Sparkles, ArrowLeft, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    country_code: '+91',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleRegister = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      await dispatch(validateUser({
        email: formData.email,
        mobile_number: formData.mobile_number,
        country_code: formData.country_code,
        login_type: 's'
      })).unwrap();

      dispatch(setTempSignupData({
        name: formData.name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        country_code: formData.country_code,
        password: formData.password,
        login_type: 's',
      }));
      navigate('/role-selection');
    } catch (error) {
      toast.error(error || "Email or mobile number already exists");
    }
  };
  return <div className="min-h-screen bg-[#0f1723] text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#1f7af9]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#bc13fe]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-[#bc13fe]/10">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-400 mb-8">Join HireSense AI today</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 transition-all" placeholder="John Doe" required />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 transition-all" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Mobile Number</label>
              <div className="flex gap-2">
                <div className="relative w-[110px]">
                  <select 
                    value={formData.country_code} 
                    onChange={e => setFormData({ ...formData, country_code: e.target.value })} 
                    className="w-full pl-3 pr-2 py-3 bg-[#1a2332] border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 transition-all appearance-none text-white h-full"
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+971">+971 (AE)</option>
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    value={formData.mobile_number} 
                    onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} 
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 transition-all" 
                    placeholder="1234567890" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={formData.password} onChange={e => setFormData({
                ...formData,
                password: e.target.value
              })} className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 transition-all" placeholder="••••••••" required />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={formData.confirmPassword} onChange={e => setFormData({
                ...formData,
                confirmPassword: e.target.value
              })} className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 transition-all" placeholder="••••••••" required />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer text-sm">
              <input type="checkbox" checked={formData.terms} onChange={e => setFormData({
              ...formData,
              terms: e.target.checked
            })} className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5" required />
              <span className="text-gray-400">
                I agree to the{' '}
                <button type="button" className="text-[#1f7af9] hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#1f7af9] hover:underline">
                  Privacy Policy
                </button>
              </span>
            </label>

            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all disabled:opacity-50">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a2332] text-gray-400">Or continue with</span>
            </div>
          </div>

          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#1f7af9] hover:underline font-semibold">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>;
}
