import { useNavigate } from 'react-router';
import { ArrowLeft, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
export function Analytics() {
  const navigate = useNavigate();
  const applicationsOverTime = [{
    month: 'Oct',
    applications: 120,
    hires: 8
  }, {
    month: 'Nov',
    applications: 145,
    hires: 12
  }, {
    month: 'Dec',
    applications: 168,
    hires: 10
  }, {
    month: 'Jan',
    applications: 192,
    hires: 15
  }, {
    month: 'Feb',
    applications: 210,
    hires: 18
  }, {
    month: 'Mar',
    applications: 185,
    hires: 14
  }, {
    month: 'Apr',
    applications: 220,
    hires: 20
  }];
  const sourceEffectiveness = [{
    source: 'LinkedIn',
    applicants: 450,
    hires: 32
  }, {
    source: 'Indeed',
    applicants: 320,
    hires: 18
  }, {
    source: 'Referral',
    applicants: 180,
    hires: 28
  }, {
    source: 'Direct',
    applicants: 120,
    hires: 12
  }, {
    source: 'Other',
    applicants: 80,
    hires: 5
  }];
  const funnelData = [{
    stage: 'Applied',
    count: 1284,
    color: '#6b7280'
  }, {
    stage: 'Screened',
    count: 856,
    color: '#3b82f6'
  }, {
    stage: 'Interviewed',
    count: 342,
    color: '#8b5cf6'
  }, {
    stage: 'Offered',
    count: 124,
    color: '#f59e0b'
  }, {
    stage: 'Hired',
    count: 95,
    color: '#10b981'
  }];
  const timeToHire = [{
    week: 'W1',
    days: 22
  }, {
    week: 'W2',
    days: 18
  }, {
    week: 'W3',
    days: 20
  }, {
    week: 'W4',
    days: 16
  }, {
    week: 'W5',
    days: 18
  }, {
    week: 'W6',
    days: 15
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-gray-400">Track recruitment metrics and performance</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last 30 days
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-lg hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">Total Applications</p>
            <p className="text-3xl font-bold mb-2">2,348</p>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>+18.2%</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">Total Hires</p>
            <p className="text-3xl font-bold mb-2">95</p>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingUp className="w-4 h-4" />
              <span>+22.6%</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">Avg Time to Hire</p>
            <p className="text-3xl font-bold mb-2">18 days</p>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <TrendingDown className="w-4 h-4" />
              <span>-12.5%</span>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <p className="text-sm text-gray-400 mb-2">Offer Acceptance</p>
            <p className="text-3xl font-bold mb-2">76.6%</p>
            <div className="flex items-center gap-2 text-sm text-[#ef4444]">
              <TrendingDown className="w-4 h-4" />
              <span>-3.2%</span>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Applications Over Time */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Applications Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#8b92a8" />
                <YAxis stroke="#8b92a8" />
                <Tooltip contentStyle={{
                backgroundColor: '#1a2332',
                border: '1px solid #ffffff20',
                borderRadius: '8px'
              }} />
                <Area type="monotone" dataKey="applications" stroke="#1f7af9" fill="#1f7af920" strokeWidth={2} />
                <Area type="monotone" dataKey="hires" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Source Effectiveness */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Source Effectiveness</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceEffectiveness}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="source" stroke="#8b92a8" />
                <YAxis stroke="#8b92a8" />
                <Tooltip contentStyle={{
                backgroundColor: '#1a2332',
                border: '1px solid #ffffff20',
                borderRadius: '8px'
              }} />
                <Bar dataKey="applicants" fill="#1f7af9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="hires" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pipeline Funnel */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Pipeline Conversion Funnel</h3>
            <div className="space-y-4">
              {funnelData.map((stage, idx) => {
              const percentage = stage.count / funnelData[0].count * 100;
              return <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">{stage.stage}</span>
                      <span className="font-semibold">{stage.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-8 bg-white/5 rounded-lg overflow-hidden">
                      <div className="h-full flex items-center justify-center text-sm font-semibold transition-all" style={{
                    width: `${percentage}%`,
                    backgroundColor: stage.color
                  }}>
                        {percentage > 20 && `${stage.count}`}
                      </div>
                    </div>
                  </div>;
            })}
            </div>
          </div>

          {/* Time to Hire Trend */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Time to Hire Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeToHire}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="week" stroke="#8b92a8" />
                <YAxis stroke="#8b92a8" />
                <Tooltip contentStyle={{
                backgroundColor: '#1a2332',
                border: '1px solid #ffffff20',
                borderRadius: '8px'
              }} />
                <Line type="monotone" dataKey="days" stroke="#bc13fe" strokeWidth={3} dot={{
                fill: '#bc13fe',
                r: 5
              }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-xl">
              <p className="text-sm text-gray-400">Average time to hire has decreased by 12.5% this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
