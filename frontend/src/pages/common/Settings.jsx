import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User, Bell, Shield, CreditCard, Zap } from 'lucide-react';
import { editProfileAPI } from '../../api/api';
import { updateUser } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

export function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || user?.fullName || '',
    email: user?.email || '',
    mobile_number: user?.mobile_number || '',
    country_code: user?.country_code || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    try {
      setLoading(true);
      const res = await editProfileAPI(formData);
      if (res?.data) {
        toast.success("Profile updated successfully!");
        dispatch(updateUser(res.data));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const dashboardPath = role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';

  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(dashboardPath)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#1f7af9]/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[#1f7af9]" />
              </div>
              <h3 className="text-2xl font-bold">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <input type="text" name="country_code" value={formData.country_code} onChange={handleInputChange} placeholder="+1" className="w-20 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
                  <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} placeholder="Phone number" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
                </div>
              </div>
              <button disabled={loading} onClick={handleProfileSave} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all disabled:opacity-70">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#bc13fe]/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#bc13fe]" />
              </div>
              <h3 className="text-2xl font-bold">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              {[{
              name: 'Email notifications',
              description: 'Receive email updates about your activity',
              enabled: true
            }, {
              name: 'Interview reminders',
              description: 'Get notified before scheduled interviews',
              enabled: true
            }, {
              name: 'Job matches',
              description: 'Alerts when new matching jobs are posted',
              enabled: true
            }, {
              name: 'Weekly summary',
              description: 'Weekly digest of your progress',
              enabled: false
            }].map(pref => <div key={pref.name} className="flex items-start justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="font-semibold mb-1">{pref.name}</p>
                    <p className="text-sm text-gray-400">{pref.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f7af9]" />
                  </label>
                </div>)}
            </div>
          </div> 
        </div>
      </div>
    </div>;
}
