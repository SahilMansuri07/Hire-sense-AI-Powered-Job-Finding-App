import { useNavigate } from 'react-router';
import { ArrowLeft, Users, Settings, TrendingUp, AlertCircle, Shield, Database } from 'lucide-react';
export function AdminPanel() {
  const navigate = useNavigate();
  const users = [{
    id: 1,
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 mins ago'
  }, {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'Recruiter',
    status: 'Active',
    lastActive: '1 hour ago'
  }, {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@company.com',
    role: 'Recruiter',
    status: 'Inactive',
    lastActive: '2 days ago'
  }, {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@company.com',
    role: 'Candidate',
    status: 'Active',
    lastActive: '5 mins ago'
  }];
  const systemHealth = [{
    metric: 'API Response Time',
    value: '142ms',
    status: 'good',
    icon: TrendingUp
  }, {
    metric: 'Database Status',
    value: 'Healthy',
    status: 'good',
    icon: Database
  }, {
    metric: 'Active Users',
    value: '2,847',
    status: 'good',
    icon: Users
  }, {
    metric: 'Error Rate',
    value: '0.02%',
    status: 'good',
    icon: AlertCircle
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage users, settings, and system health</p>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {systemHealth.map(item => <div key={item.metric} className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#10b981]" />
                </div>
                <span className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-xs">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-1">{item.metric}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>)}
        </div>

        {/* Subscription Tiers */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <h3 className="text-2xl font-bold mb-6">Subscription Tiers</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl">
              <h4 className="text-xl font-bold mb-2">Free</h4>
              <p className="text-3xl font-bold mb-4">$0<span className="text-sm text-gray-400">/mo</span></p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 5 job postings</li>
                <li>• Basic ATS features</li>
                <li>• Email support</li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-[#1f7af9]/20 to-[#1f7af9]/0 border-2 border-[#1f7af9] rounded-xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1f7af9] rounded-full text-xs font-semibold">
                Popular
              </span>
              <h4 className="text-xl font-bold mb-2">Pro</h4>
              <p className="text-3xl font-bold mb-4">$99<span className="text-sm text-gray-400">/mo</span></p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Unlimited job postings</li>
                <li>• Advanced AI matching</li>
                <li>• Priority support</li>
                <li>• Custom branding</li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl">
              <h4 className="text-xl font-bold mb-2">Enterprise</h4>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Everything in Pro</li>
                <li>• Dedicated support</li>
                <li>• SLA guarantees</li>
                <li>• Custom integrations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">User Management</h3>
            <button className="px-4 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
              Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Last Active</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-lg flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded text-[#1f7af9] text-xs">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 border rounded text-xs ${user.status === 'Active' ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' : 'bg-white/5 border-white/20 text-gray-400'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{user.lastActive}</td>
                    <td className="py-4 px-4">
                      <button className="text-[#1f7af9] hover:underline text-sm">Edit</button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6">Feature Toggles</h3>
          <div className="space-y-4">
            {[{
            name: 'AI Interview Analysis',
            enabled: true
          }, {
            name: 'Advanced Analytics',
            enabled: true
          }, {
            name: 'Email Notifications',
            enabled: true
          }, {
            name: 'Dark Mode',
            enabled: true
          }, {
            name: 'Beta Features',
            enabled: false
          }].map(feature => <div key={feature.name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold">{feature.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={feature.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1f7af9]" />
                </label>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
