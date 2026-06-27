import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, MessageSquare, Award, Download, Share2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
export function InterviewResults() {
  const navigate = useNavigate();
  const overallScore = 87;
  const questionScores = [{
    question: 'Q1',
    score: 85
  }, {
    question: 'Q2',
    score: 92
  }, {
    question: 'Q3',
    score: 84
  }];
  const toneAnalysis = [{
    metric: 'Clarity',
    score: 88
  }, {
    metric: 'Confidence',
    score: 82
  }, {
    metric: 'Professionalism',
    score: 91
  }, {
    metric: 'Engagement',
    score: 85
  }];
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6
        }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-xl text-gray-400">Great job! Here's your detailed performance analysis</p>
        </div>

        {/* Overall Score */}
        <div className="p-8 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 backdrop-blur border border-white/10 rounded-3xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Overall Performance</h2>
              <p className="text-gray-400 mb-4">Based on AI analysis of your responses</p>
              <div className="flex items-center gap-2 text-[#10b981]">
                <TrendingUp className="w-5 h-5" />
                <span>Excellent performance - Top 15%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mb-2">
                <span className="text-5xl font-black">{overallScore}</span>
              </div>
              <p className="text-sm text-gray-400">out of 100</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Per-Question Scores */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Question Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={questionScores}>
                <XAxis dataKey="question" stroke="#8b92a8" />
                <YAxis stroke="#8b92a8" />
                <Bar dataKey="score" fill="#1f7af9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {questionScores.map((q, idx) => <div key={idx} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Question {idx + 1}</span>
                    <span className="font-semibold text-[#1f7af9]">{q.score}/100</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {idx === 0 && "Tell me about a time when you had to work with a difficult team member."}
                    {idx === 1 && "Describe your experience with React and how you've used it in production."}
                    {idx === 2 && "How do you handle tight deadlines and competing priorities?"}
                  </p>
                </div>)}
            </div>
          </div>

          {/* Tone Analysis */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Communication Analysis</h3>
            <div className="space-y-4">
              {toneAnalysis.map(metric => <div key={metric.metric}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">{metric.metric}</span>
                    <span className="font-semibold">{metric.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#1f7af9] to-[#bc13fe]" style={{
                  width: `${metric.score}%`
                }} />
                  </div>
                </div>)}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-[#f59e0b]" />
                <span className="font-semibold">Filler Words</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Detected 8 filler words (um, like, you know)</p>
              <p className="text-xs text-gray-500">Try to reduce filler words for more confident delivery</p>
            </div>
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-6">
          <h3 className="text-2xl font-bold mb-6">Improvement Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#10b981]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <p className="font-semibold mb-1">Great use of STAR method</p>
                  <p className="text-sm text-gray-400">Your answers were well-structured with clear Situation, Task, Action, and Result</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#10b981]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <p className="font-semibold mb-1">Strong technical knowledge</p>
                  <p className="text-sm text-gray-400">Demonstrated deep understanding of React and modern development practices</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  !
                </div>
                <div>
                  <p className="font-semibold mb-1">Reduce filler words</p>
                  <p className="text-sm text-gray-400">Practice pausing instead of using "um" or "like" to sound more confident</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#f59e0b]/20 to-[#f59e0b]/5 border border-[#f59e0b]/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  !
                </div>
                <div>
                  <p className="font-semibold mb-1">Maintain eye contact</p>
                  <p className="text-sm text-gray-400">Look directly at the camera more often to create better engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#1f7af9]/40 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button onClick={() => navigate('/candidate/interview-setup')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            Practice Again
          </button>
        </div>
      </div>
    </div>;
}
