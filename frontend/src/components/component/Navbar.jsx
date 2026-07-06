import { Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function Navbar() {
    const { isAuthenticated, role, user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0f1723]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-lg flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <span 
              className="text-xl font-bold cursor-pointer tracking-tight" 
              onClick={() => navigate(isAuthenticated ? (role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard') : '/')}
            >
              HireSense AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard')} 
                  className="hidden md:block px-4 py-2 text-sm hover:text-[#1f7af9] transition-colors font-medium"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate(role === 'recruiter' ? '/settings' : '/candidate/profile')} 
                  className="flex items-center gap-2 px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] flex items-center justify-center shadow-lg font-bold text-white text-sm">
                    {user?.name?.charAt(0) || user?.first_name?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:block text-sm font-medium pr-2">{user?.name || user?.first_name || 'Profile'}</span>
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm hover:text-[#1f7af9] transition-colors font-medium">
                  Log In
                </button>
                <button onClick={() => navigate('/register')} className="px-6 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    )
}