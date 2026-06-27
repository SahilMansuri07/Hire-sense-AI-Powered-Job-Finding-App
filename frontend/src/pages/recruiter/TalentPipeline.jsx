import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export function TalentPipeline() {
  const navigate = useNavigate();
  const stages = [{
    id: 'applied',
    title: 'Applied',
    color: '#6b7280',
    count: 24
  }, {
    id: 'screening',
    title: 'Screening',
    color: '#3b82f6',
    count: 12
  }, {
    id: 'interview',
    title: 'Interview',
    color: '#8b5cf6',
    count: 8
  }, {
    id: 'offer',
    title: 'Offer',
    color: '#f59e0b',
    count: 3
  }, {
    id: 'hired',
    title: 'Hired',
    color: '#10b981',
    count: 2
  }];
  const candidates = {
    applied: [{
      id: 1,
      name: 'John Smith',
      role: 'Backend Developer',
      score: 88,
      avatar: '👨'
    }, {
      id: 2,
      name: 'Lisa Wong',
      role: 'UX Designer',
      score: 85,
      avatar: '👩'
    }, {
      id: 3,
      name: 'David Park',
      role: 'DevOps Engineer',
      score: 82,
      avatar: '👨'
    }],
    screening: [{
      id: 4,
      name: 'Sarah Chen',
      role: 'Senior Frontend Dev',
      score: 96,
      avatar: '👩'
    }, {
      id: 5,
      name: 'Tom Wilson',
      role: 'Product Manager',
      score: 90,
      avatar: '👨'
    }],
    interview: [{
      id: 6,
      name: 'Michael Brown',
      role: 'Full Stack Engineer',
      score: 94,
      avatar: '👨'
    }, {
      id: 7,
      name: 'Emily Davis',
      role: 'React Developer',
      score: 91,
      avatar: '👩'
    }],
    offer: [{
      id: 8,
      name: 'Alex Johnson',
      role: 'Tech Lead',
      score: 97,
      avatar: '👨'
    }],
    hired: [{
      id: 9,
      name: 'Maria Garcia',
      role: 'Senior Designer',
      score: 95,
      avatar: '👩'
    }]
  };
  return <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#0f1723] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Talent Pipeline</h1>
              <p className="text-gray-400">Drag and drop candidates to manage your hiring pipeline</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-5 gap-4">
            {stages.map(stage => <div key={stage.id} className="flex flex-col h-full">
                {/* Stage Header */}
                <div className="p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{stage.title}</h3>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold" style={{
                  backgroundColor: `${stage.color}30`,
                  color: stage.color
                }}>
                      {stage.count}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{
                backgroundColor: `${stage.color}30`
              }}>
                    <div className="h-full rounded-full" style={{
                  backgroundColor: stage.color,
                  width: '60%'
                }} />
                  </div>
                </div>

                {/* Candidate Cards */}
                <div className="flex-1 space-y-3 min-h-[600px] p-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl">
                  {candidates[stage.id]?.map(candidate => <div key={candidate.id} onClick={() => navigate('/recruiter/candidate/1')} className="p-4 bg-white/10 backdrop-blur border border-white/10 rounded-xl hover:border-[#1f7af9]/50 hover:shadow-lg hover:shadow-[#1f7af9]/20 transition-all cursor-pointer group">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {candidate.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate group-hover:text-[#1f7af9] transition-colors">
                            {candidate.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{candidate.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-xs">
                          {candidate.score}%
                        </span>
                        <button className="text-xs text-gray-400 hover:text-white transition-colors">
                          View →
                        </button>
                      </div>
                    </div>)}

                  {/* Add Candidate Button */}
                  <button className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-white">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add Candidate</span>
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </DndProvider>;
}
