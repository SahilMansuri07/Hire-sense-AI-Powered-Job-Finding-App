import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
export function AptitudeTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  const questions = [{
    id: 1,
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
    options: ["True", "False", "Cannot be determined", "None of the above"],
    correct: 0
  }, {
    id: 2,
    question: "A train traveling at 60 mph leaves Station A at 2:00 PM. Another train traveling at 80 mph leaves Station B (240 miles away) at 2:30 PM heading toward Station A. At what time will they meet?",
    options: ["4:15 PM", "4:30 PM", "4:45 PM", "5:00 PM"],
    correct: 1
  }, {
    id: 3,
    question: "What number should come next in this sequence: 2, 6, 12, 20, 30, ?",
    options: ["38", "40", "42", "44"],
    correct: 2
  }, {
    id: 4,
    question: "If the day before yesterday was Thursday, what will be the day after tomorrow?",
    options: ["Sunday", "Monday", "Tuesday", "Wednesday"],
    correct: 1
  }, {
    id: 5,
    question: "Find the odd one out: Dog, Cat, Horse, Tiger, Elephant",
    options: ["Dog", "Cat", "Horse", "Tiger"],
    correct: 3
  }];
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handleSubmit = () => {
    const score = Object.entries(selectedAnswers).filter(([qIdx, answer]) => questions[parseInt(qIdx)].correct === answer).length;
    alert(`Test Complete! Score: ${score}/${questions.length}`);
    navigate('/candidate/dashboard');
  };
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/candidate/dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Aptitude Test</h1>
              <p className="text-gray-400">TechCorp - Senior Frontend Developer</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-2xl font-mono font-bold text-[#f59e0b]">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-gray-400">{Object.keys(selectedAnswers).length} answered</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] transition-all duration-300" style={{
            width: `${(currentQuestion + 1) / questions.length * 100}%`
          }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="mb-8">
            <span className="px-3 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded-lg text-sm text-[#1f7af9]">
              Question {currentQuestion + 1}
            </span>
            <h2 className="text-2xl font-semibold mt-4 mb-6">{questions[currentQuestion].question}</h2>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => <button key={idx} onClick={() => setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: idx
          })} className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${selectedAnswers[currentQuestion] === idx ? 'bg-[#1f7af9]/20 border-[#1f7af9]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentQuestion] === idx ? 'border-[#1f7af9] bg-[#1f7af9]' : 'border-white/30'}`}>
                  {selectedAnswers[currentQuestion] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>{option}</span>
              </button>)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => <button key={idx} onClick={() => setCurrentQuestion(idx)} className={`w-10 h-10 rounded-lg border transition-all ${idx === currentQuestion ? 'bg-[#1f7af9] border-[#1f7af9] text-white' : selectedAnswers[idx] !== undefined ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                {idx + 1}
              </button>)}
          </div>

          {currentQuestion === questions.length - 1 ? <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-xl hover:shadow-2xl hover:shadow-[#10b981]/40 transition-all flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Submit Test
            </button> : <button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
              Next
            </button>}
        </div>
      </div>
    </div>;
}
