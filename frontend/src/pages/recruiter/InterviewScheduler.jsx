import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Video, User, ChevronLeft, ChevronRight } from 'lucide-react';
export function InterviewScheduler() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const candidates = [{
    id: 1,
    name: 'Sarah Chen',
    role: 'Senior Frontend Dev',
    avatar: '👩',
    score: 96
  }, {
    id: 2,
    name: 'Michael Brown',
    role: 'Full Stack Engineer',
    avatar: '👨',
    score: 94
  }, {
    id: 3,
    name: 'Emily Davis',
    role: 'React Developer',
    avatar: '👩',
    score: 91
  }];
  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
  const upcomingInterviews = [{
    candidate: 'John Smith',
    role: 'Backend Developer',
    time: 'Today, 2:00 PM',
    interviewer: 'Jane D.'
  }, {
    candidate: 'Lisa Wong',
    role: 'UX Designer',
    time: 'Tomorrow, 10:00 AM',
    interviewer: 'Mike R.'
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/recruiter/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Scheduler</h1>
          <p className="text-gray-400">Schedule and manage candidate interviews</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendar & Time Slots */}
          <div className="md:col-span-2 space-y-6">
            {/* Mini Calendar */}
            <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Select Date</h3>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-semibold">April 2026</span>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-center text-sm text-gray-500 py-2">
                    {day}
                  </div>)}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({
                length: 30
              }, (_, i) => i + 1).map(day => <button key={day} onClick={() => setSelectedDate(new Date(2026, 3, day))} className={`aspect-square rounded-lg flex items-center justify-center transition-all ${day === 23 ? 'bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] text-white font-semibold' : day < 23 ? 'text-gray-600 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10'}`} disabled={day < 23}>
                    {day}
                  </button>)}
              </div>
            </div>

            {/* Time Slots */}
            <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Available Time Slots</h3>
              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map(slot => <button key={slot} onClick={() => setSelectedSlot(slot)} className={`px-4 py-3 rounded-xl border transition-all ${selectedSlot === slot ? 'bg-[#1f7af9]/20 border-[#1f7af9] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                    {slot}
                  </button>)}
              </div>
            </div>

            {/* Schedule Confirmation */}
            {selectedSlot && <div className="p-6 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 backdrop-blur border border-white/10 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Select Candidate</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#1f7af9]">
                      <option value="">Choose a candidate</option>
                      {candidates.map(candidate => <option key={candidate.id} value={candidate.id}>
                          {candidate.name} - {candidate.role}
                        </option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Interview Type</label>
                    <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#1f7af9]">
                      <option>Phone Screening</option>
                      <option>Technical Interview</option>
                      <option>Behavioral Interview</option>
                      <option>Final Interview</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Interviewer</label>
                    <input type="text" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#1f7af9]" placeholder="Enter interviewer name" />
                  </div>

                  <button className="w-full py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all">
                    Confirm & Send Invite
                  </button>
                </div>
              </div>}
          </div>

          {/* Sidebar - Candidates & Upcoming */}
          <div className="space-y-6">
            {/* Candidates to Schedule */}
            <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <h3 className="text-lg font-bold mb-4">Candidates to Schedule</h3>
              <div className="space-y-3">
                {candidates.map(candidate => <div key={candidate.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-lg flex items-center justify-center text-xl">
                        {candidate.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{candidate.name}</p>
                        <p className="text-xs text-gray-400">{candidate.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#10b981]/20 border border-[#10b981] rounded text-[#10b981] text-xs">
                        {candidate.score}% Match
                      </span>
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <h3 className="text-lg font-bold mb-4">Upcoming Interviews</h3>
              <div className="space-y-3">
                {upcomingInterviews.map((interview, idx) => <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="font-semibold text-sm mb-1">{interview.candidate}</p>
                    <p className="text-xs text-gray-400 mb-2">{interview.role}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {interview.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <User className="w-3 h-3" />
                      {interview.interviewer}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
