import { useNavigate } from 'react-router';
import { ArrowLeft, Lightbulb, MessageSquare, Video, BookOpen, Target, Zap } from 'lucide-react';
export function InterviewPreparation() {
  const navigate = useNavigate();
  const tips = [{
    category: 'Before Interview',
    icon: Target,
    color: '#1f7af9',
    items: ['Research the company and role thoroughly', 'Prepare STAR method examples from your experience', 'Test your camera, microphone, and internet connection', 'Choose a quiet, well-lit location', 'Dress professionally, even for video interviews']
  }, {
    category: 'During Interview',
    icon: Video,
    color: '#bc13fe',
    items: ['Make eye contact by looking at the camera', 'Speak clearly and at a moderate pace', 'Use the STAR method for behavioral questions', 'Ask clarifying questions if needed', 'Take brief notes during the conversation']
  }, {
    category: 'After Interview',
    icon: Lightbulb,
    color: '#10b981',
    items: ['Send a thank you email within 24 hours', 'Reflect on questions you found challenging', 'Follow up if you haven\'t heard back in a week', 'Continue practicing for future interviews', 'Update your interview notes and learnings']
  }];
  const commonQuestions = [{
    category: 'Behavioral',
    questions: ['Tell me about yourself', 'Describe a time when you faced a difficult challenge', 'How do you handle conflict with team members?', 'What is your greatest strength and weakness?', 'Where do you see yourself in 5 years?']
  }, {
    category: 'Technical',
    questions: ['Explain the difference between var, let, and const', 'What are closures in JavaScript?', 'How does the virtual DOM work in React?', 'Explain RESTful API principles', 'What is the difference between SQL and NoSQL databases?']
  }, {
    category: 'Situational',
    questions: ['How would you prioritize tasks when everything is urgent?', 'Describe a time you had to learn a new technology quickly', 'How do you ensure code quality in your projects?', 'What would you do if you disagreed with your manager?', 'How do you stay updated with new technologies?']
  }];
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Preparation</h1>
          <p className="text-gray-400">Tips, tricks, and practice questions to ace your interviews</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button onClick={() => navigate('/candidate/interview-setup')} className="p-6 bg-gradient-to-br from-[#1f7af9]/20 to-[#1f7af9]/5 border border-[#1f7af9]/30 rounded-2xl hover:border-[#1f7af9] hover:shadow-lg hover:shadow-[#1f7af9]/30 transition-all text-left group">
            <Video className="w-10 h-10 text-[#1f7af9] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Practice Mock Interview</h3>
            <p className="text-sm text-gray-400">Get AI feedback on your interview performance</p>
          </button>

          <button onClick={() => navigate('/candidate/aptitude-test')} className="p-6 bg-gradient-to-br from-[#bc13fe]/20 to-[#bc13fe]/5 border border-[#bc13fe]/30 rounded-2xl hover:border-[#bc13fe] hover:shadow-lg hover:shadow-[#bc13fe]/30 transition-all text-left group">
            <BookOpen className="w-10 h-10 text-[#bc13fe] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Take Aptitude Test</h3>
            <p className="text-sm text-gray-400">Practice logical reasoning and problem solving</p>
          </button>

          <button onClick={() => navigate('/candidate/technical-test')} className="p-6 bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/5 border border-[#10b981]/30 rounded-2xl hover:border-[#10b981] hover:shadow-lg hover:shadow-[#10b981]/30 transition-all text-left group">
            <Zap className="w-10 h-10 text-[#10b981] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Take Technical Test</h3>
            <p className="text-sm text-gray-400">Solve coding challenges and technical questions</p>
          </button>
        </div>

        {/* Interview Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Interview Tips & Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tips.map(tip => <div key={tip.category} className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                backgroundColor: `${tip.color}20`
              }}>
                    <tip.icon className="w-6 h-6" style={{
                  color: tip.color
                }} />
                  </div>
                  <h3 className="text-xl font-bold">{tip.category}</h3>
                </div>
                <ul className="space-y-3">
                  {tip.items.map((item, idx) => <li key={idx} className="flex gap-3 text-sm text-gray-400">
                      <span className="text-[#10b981] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>

        {/* Common Interview Questions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Common Interview Questions</h2>
          <div className="space-y-6">
            {commonQuestions.map(category => <div key={category.category} className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-[#1f7af9]" />
                  <h3 className="text-xl font-bold">{category.category} Questions</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.questions.map((question, idx) => <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-1 bg-[#1f7af9]/20 border border-[#1f7af9] rounded text-[#1f7af9] text-xs flex-shrink-0">
                          Q{idx + 1}
                        </span>
                        <p className="text-sm">{question}</p>
                      </div>
                    </div>)}
                </div>
              </div>)}
          </div>
        </div>

        {/* STAR Method Guide */}
        <div className="mt-8 p-8 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 backdrop-blur border border-white/10 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">STAR Method Framework</h2>
          <p className="text-gray-400 mb-6">Use this framework to structure your behavioral interview answers</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[{
            letter: 'S',
            title: 'Situation',
            desc: 'Set the context and background'
          }, {
            letter: 'T',
            title: 'Task',
            desc: 'Describe the challenge or responsibility'
          }, {
            letter: 'A',
            title: 'Action',
            desc: 'Explain what you did specifically'
          }, {
            letter: 'R',
            title: 'Result',
            desc: 'Share the outcome and impact'
          }].map(step => <div key={step.letter} className="p-5 bg-white/10 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1f7af9] to-[#bc13fe] rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl font-black">{step.letter}</span>
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
