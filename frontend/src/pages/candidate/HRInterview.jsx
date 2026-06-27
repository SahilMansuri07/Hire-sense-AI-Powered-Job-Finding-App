import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Building2, DollarSign, Calendar, MessageSquare } from 'lucide-react';
export function HRInterview() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const questions = [{
    id: 1,
    icon: User,
    color: '#1f7af9',
    question: "Tell me about yourself and your background.",
    placeholder: "Share your professional journey, key achievements, and what motivates you..."
  }, {
    id: 2,
    icon: Building2,
    color: '#bc13fe',
    question: "Why are you interested in working for our company?",
    placeholder: "Explain what attracted you to this role and company..."
  }, {
    id: 3,
    icon: DollarSign,
    color: '#10b981',
    question: "What are your salary expectations for this role?",
    placeholder: "Share your expected salary range and any other compensation preferences..."
  }, {
    id: 4,
    icon: Calendar,
    color: '#f59e0b',
    question: "When can you start if offered the position?",
    placeholder: "Mention your notice period and ideal start date..."
  }, {
    id: 5,
    icon: MessageSquare,
    color: '#1f7af9',
    question: "Do you have any questions for us?",
    placeholder: "Ask about company culture, team structure, growth opportunities, etc..."
  }];
  const handleSubmit = () => {
    alert('HR interview responses submitted successfully!');
    navigate('/candidate/dashboard');
  };
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">HR Interview Round</h1>
          <p className="text-gray-400">TechCorp - Senior Frontend Developer</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-gray-400">{Object.keys(responses).length} answered</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] transition-all duration-300" style={{
            width: `${(currentQuestion + 1) / questions.length * 100}%`
          }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{
            backgroundColor: `${questions[currentQuestion].color}20`
          }}>
              {(() => {
              const IconComponent = questions[currentQuestion].icon;
              return <IconComponent className="w-8 h-8" style={{
                color: questions[currentQuestion].color
              }} />;
            })()}
            </div>
            <div className="flex-1">
              <span className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded-lg text-sm text-[#1f7af9]">
                Question {currentQuestion + 1}
              </span>
              <h2 className="text-2xl font-semibold mt-4">{questions[currentQuestion].question}</h2>
            </div>
          </div>

          <textarea value={responses[currentQuestion] || ''} onChange={e => setResponses({
          ...responses,
          [currentQuestion]: e.target.value
        })} placeholder={questions[currentQuestion].placeholder} className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 resize-none" />

          <p className="text-sm text-gray-500 mt-2">
            Tip: Use the STAR method (Situation, Task, Action, Result) when applicable
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => <button key={idx} onClick={() => setCurrentQuestion(idx)} className={`w-10 h-10 rounded-lg border transition-all ${idx === currentQuestion ? 'bg-[#1f7af9] border-[#1f7af9] text-white' : responses[idx] ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                {idx + 1}
              </button>)}
          </div>

          {currentQuestion === questions.length - 1 ? <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-xl hover:shadow-2xl hover:shadow-[#10b981]/40 transition-all">
              Submit Interview
            </button> : <button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
              Next
            </button>}
        </div>
      </div>
    </div>;
}
