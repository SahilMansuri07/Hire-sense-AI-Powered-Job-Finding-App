import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Video, Mic, Square, User, Brain } from 'lucide-react';
export function InterviewLive() {
  const navigate = useNavigate();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [confidence, setConfidence] = useState(75);
  const [emotion, setEmotion] = useState('Confident');
  const questions = ["Tell me about a time when you had to work with a difficult team member.", "Describe your experience with React and how you've used it in production.", "How do you handle tight deadlines and competing priorities?"];
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      setConfidence(Math.min(100, Math.max(50, confidence + (Math.random() - 0.5) * 5)));
    }, 1000);
    return () => clearInterval(timer);
  }, [confidence]);
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handleEndInterview = () => {
    navigate('/candidate/interview-results/1');
  };
  return <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-[#0f1723]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#ef4444] rounded-full animate-pulse" />
            <span className="font-semibold">Recording Interview</span>
            <span className="text-gray-400">|</span>
            <span className="font-mono text-gray-400">{formatTime(timeElapsed)}</span>
          </div>
          <button onClick={handleEndInterview} className="px-6 py-2 bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] rounded-lg hover:bg-[#ef4444]/30 transition-all flex items-center gap-2">
            <Square className="w-4 h-4" />
            End Interview
          </button>
        </div>
      </div>

      {/* Main Interview Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* AI Interviewer */}
          <div className="relative aspect-video bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-3xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-full flex items-center justify-center">
                <Brain className="w-16 h-16" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/50 backdrop-blur rounded-lg">
              <span className="text-sm">AI Interviewer</span>
            </div>
          </div>

          {/* Candidate Video */}
          <div className="relative aspect-video bg-black/80 rounded-3xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/50 backdrop-blur rounded-lg flex items-center gap-2">
              <Video className="w-4 h-4 text-[#10b981]" />
              <Mic className="w-4 h-4 text-[#10b981]" />
              <span className="text-sm">You</span>
            </div>
          </div>
        </div>

        {/* Question Display */}
        <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="flex gap-2">
              {questions.map((_, idx) => <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentQuestion ? 'bg-[#1f7af9]' : 'bg-white/20'}`} />)}
            </div>
          </div>
          <p className="text-2xl font-semibold mb-6">{questions[currentQuestion]}</p>
          <div className="flex gap-3">
            {currentQuestion > 0 && <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                Previous
              </button>}
            {currentQuestion < questions.length - 1 && <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="px-6 py-3 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all">
                Next Question
              </button>}
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Confidence</span>
              <span className="text-2xl font-bold text-[#1f7af9]">{Math.round(confidence)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] transition-all duration-300" style={{
              width: `${confidence}%`
            }} />
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Emotion</span>
              <span className="text-2xl font-bold text-[#10b981]">{emotion}</span>
            </div>
            <p className="text-sm text-gray-500">Detected from facial analysis</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">Filler Words</span>
              <span className="text-2xl font-bold text-[#f59e0b]">8</span>
            </div>
            <p className="text-sm text-gray-500">um, like, you know...</p>
          </div>
        </div>
      </div>
    </div>;
}
