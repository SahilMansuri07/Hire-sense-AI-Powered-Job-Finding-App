import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, Video, FileText, Briefcase, Sparkles, CheckCheck } from 'lucide-react';
export function Notifications() {
  const navigate = useNavigate();
  const notifications = [{
    id: 1,
    type: 'interview',
    icon: Video,
    color: '#1f7af9',
    title: 'Interview scheduled',
    message: 'Your interview with TechCorp is scheduled for tomorrow at 2:00 PM',
    time: '5 mins ago',
    read: false
  }, {
    id: 2,
    type: 'application',
    icon: Briefcase,
    color: '#10b981',
    title: 'Application update',
    message: 'Your application for Senior Frontend Developer has moved to the interview stage',
    time: '1 hour ago',
    read: false
  }, {
    id: 3,
    type: 'resume',
    icon: FileText,
    color: '#bc13fe',
    title: 'ATS score improved',
    message: 'Great job! Your resume ATS score increased to 84/100',
    time: '3 hours ago',
    read: true
  }, {
    id: 4,
    type: 'tip',
    icon: Sparkles,
    color: '#f59e0b',
    title: 'AI tip of the day',
    message: 'Try practicing STAR method responses to improve your interview performance',
    time: '1 day ago',
    read: true
  }, {
    id: 5,
    type: 'interview',
    icon: Video,
    color: '#1f7af9',
    title: 'Interview completed',
    message: 'You scored 87/100 on your mock interview with StartupXYZ',
    time: '2 days ago',
    read: true
  }, {
    id: 6,
    type: 'application',
    icon: Briefcase,
    color: '#10b981',
    title: 'New job matches',
    message: '5 new jobs match your profile - check them out!',
    time: '3 days ago',
    read: true
  }];
  const unreadCount = notifications.filter(n => !n.read).length;
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              <CheckCheck className="w-5 h-5" />
              Mark all as read
            </button>}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map(notification => <div key={notification.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${notification.read ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gradient-to-r from-[#1f7af9]/10 to-[#bc13fe]/10 border-[#1f7af9]/30 hover:border-[#1f7af9]/50'}`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              backgroundColor: `${notification.color}20`
            }}>
                  <notification.icon className="w-6 h-6" style={{
                color: notification.color
              }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && <span className="w-2 h-2 bg-[#1f7af9] rounded-full" />}
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0">{notification.time}</span>
                  </div>
                  <p className="text-gray-400">{notification.message}</p>
                </div>
              </div>
            </div>)}
        </div>

        {/* Settings Link */}
        <div className="mt-8 p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Manage Notification Preferences</h3>
          <p className="text-gray-400 mb-4">Choose which notifications you want to receive</p>
          <button onClick={() => navigate('/settings')} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
            Go to Settings
          </button>
        </div>
      </div>
    </div>;
}
