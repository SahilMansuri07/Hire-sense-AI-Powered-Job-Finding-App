import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { 
  Users, Plus, Bell, Settings, LayoutDashboard, Briefcase, 
  BarChart2, Menu, X, LogOut
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';

export function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
    { name: 'Jobs', icon: Briefcase, path: '/recruiter/jobs' },
    { name: 'Post Job', icon: Plus, path: '/recruiter/post-job' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Application', icon: Users, path: '/recruiter/applications' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Notifications', icon: Bell, path: '/notifications' }
  ];

  return (
    <div className="flex h-screen bg-[#0f1723] text-white overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0f1723] border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/recruiter/dashboard')}>HireSense AI</h1>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const active = currentPath === item.path || (item.path !== '/recruiter/dashboard' && currentPath.startsWith(item.path));
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active 
                    ? 'bg-[#1f7af9] text-white font-semibold shadow-lg shadow-[#1f7af9]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] flex items-center justify-center font-bold text-white shadow-inner">
              {user?.name?.charAt(0) || user?.first_name?.charAt(0) || 'R'}
            </div>
            <div className="flex-1 truncate">
              <p className="font-semibold text-sm truncate">{user?.name || user?.first_name || 'Recruiter'}</p>
              <p className="text-xs text-gray-400">recruiter</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Slim Top Header */}
        <header className="h-20 shrink-0 flex items-center justify-between px-6 border-b border-white/10 bg-[#0f1723]/95 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold hidden sm:block">Welcome back, {user?.name || user?.first_name || 'Recruiter'}! 👋</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/recruiter/post-job')} className="hidden sm:flex px-4 py-2 bg-[#1f7af9] rounded-lg hover:bg-[#1f7af9]/90 font-medium transition-all shadow-lg shadow-[#1f7af9]/20 items-center gap-2">
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
            <button onClick={() => navigate('/notifications')} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors relative border border-white/5">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ef4444] border-2 border-[#0f1723] rounded-full" />
            </button>
            <button onClick={() => navigate('/settings')} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors hidden sm:block border border-white/5">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
            <button onClick={handleLogout} className="p-2.5 bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 rounded-full transition-colors border border-[#ef4444]/20">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
