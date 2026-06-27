import { useNavigate } from 'react-router';
import { ArrowLeft, User, Bell, Shield, CreditCard, Zap } from 'lucide-react';
export function Settings() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
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
                  <input type="text" defaultValue="Alex Johnson" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input type="email" defaultValue="alex.johnson@email.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Bio</label>
                <textarea defaultValue="Passionate frontend developer with 8 years of experience..." className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none" />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                Save Changes
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

          {/* Subscription & Billing */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#10b981]" />
              </div>
              <h3 className="text-2xl font-bold">Subscription & Billing</h3>
            </div>

            {/* Current Plan */}
            <div className="p-6 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 border border-white/10 rounded-xl mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Plan</p>
                  <p className="text-3xl font-bold">Pro</p>
                  <p className="text-gray-400 mt-2">$99/month • Renews on May 23, 2026</p>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                  Upgrade
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white/10 rounded text-sm">Unlimited job postings</span>
                <span className="px-3 py-1 bg-white/10 rounded text-sm">Advanced AI matching</span>
                <span className="px-3 py-1 bg-white/10 rounded text-sm">Priority support</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <p className="font-semibold mb-3">Payment Method</p>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                    💳
                  </div>
                  <div>
                    <p className="font-semibold">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-400">Expires 12/2027</p>
                  </div>
                </div>
                <button className="text-[#1f7af9] hover:underline">Update</button>
              </div>
            </div>

            {/* Invoice History */}
            <div>
              <p className="font-semibold mb-3">Recent Invoices</p>
              <div className="space-y-2">
                {[{
                date: 'Apr 1, 2026',
                amount: '$99.00',
                status: 'Paid'
              }, {
                date: 'Mar 1, 2026',
                amount: '$99.00',
                status: 'Paid'
              }, {
                date: 'Feb 1, 2026',
                amount: '$99.00',
                status: 'Paid'
              }].map((invoice, idx) => <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex gap-4">
                      <span className="text-gray-400">{invoice.date}</span>
                      <span className="font-semibold">{invoice.amount}</span>
                      <span className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-xs">
                        {invoice.status}
                      </span>
                    </div>
                    <button className="text-[#1f7af9] hover:underline text-sm">Download</button>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-2xl font-bold">Security</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left flex items-center justify-between">
                <span className="font-semibold">Change Password</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left flex items-center justify-between">
                <span className="font-semibold">Two-Factor Authentication</span>
                <span className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-xs">
                  Enabled
                </span>
              </button>
              <button className="w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left flex items-center justify-between">
                <span className="font-semibold">Active Sessions</span>
                <span className="text-gray-400">3 devices</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
