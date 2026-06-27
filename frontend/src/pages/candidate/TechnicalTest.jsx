import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clock, Play, CheckCircle, Code } from 'lucide-react';
export function TechnicalTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [testResults, setTestResults] = useState([]);
  const questions = [{
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    starterCode: "function twoSum(nums, target) {\n  // Your code here\n  \n}"
  }, {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    example: "Input: s = ['h','e','l','l','o']\nOutput: ['o','l','l','e','h']",
    starterCode: "function reverseString(s) {\n  // Your code here\n  \n}"
  }, {
    id: 3,
    title: "Valid Palindrome",
    difficulty: "Medium",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    example: "Input: s = 'A man, a plan, a canal: Panama'\nOutput: true",
    starterCode: "function isPalindrome(s) {\n  // Your code here\n  \n}"
  }];
  useEffect(() => {
    setCode(questions[currentQuestion].starterCode);
  }, [currentQuestion]);
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
  const handleRunCode = () => {
    setTestResults(['✓ Test case 1 passed', '✓ Test case 2 passed', '✗ Test case 3 failed: Expected [0,1] but got undefined']);
  };
  const handleSubmit = () => {
    alert('Technical test submitted successfully!');
    navigate('/candidate/dashboard');
  };
  return <div className="min-h-screen bg-[#0f1723] text-white">
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-[#0f1723]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/candidate/dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Technical Assessment</h1>
              <p className="text-sm text-gray-400">TechCorp - Senior Frontend Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-mono font-bold text-[#f59e0b]">{formatTime(timeLeft)}</span>
            </div>
            <button onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-lg hover:shadow-lg hover:shadow-[#10b981]/30 transition-all flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Question Tabs */}
        <div className="flex gap-2 mb-6">
          {questions.map((q, idx) => <button key={q.id} onClick={() => setCurrentQuestion(idx)} className={`px-4 py-2 rounded-lg border transition-all ${idx === currentQuestion ? 'bg-[#1f7af9]/20 border-[#1f7af9] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
              Problem {idx + 1}
            </button>)}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">{questions[currentQuestion].title}</h2>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${questions[currentQuestion].difficulty === 'Easy' ? 'bg-[#10b981]/20 border border-[#10b981] text-[#10b981]' : 'bg-[#f59e0b]/20 border border-[#f59e0b] text-[#f59e0b]'}`}>
                {questions[currentQuestion].difficulty}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-400">{questions[currentQuestion].description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Example</h3>
                <pre className="p-4 bg-black/50 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {questions[currentQuestion].example}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Constraints</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 1 ≤ nums.length ≤ 10⁴</li>
                  <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>• Only one valid answer exists</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code Editor
                </h3>
                <button onClick={handleRunCode} className="px-4 py-2 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] rounded-lg hover:bg-[#10b981]/30 transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Run Code
                </button>
              </div>

              <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-80 px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#1f7af9] focus:ring-2 focus:ring-[#1f7af9]/20 font-mono text-sm resize-none" spellCheck={false} />
            </div>

            {/* Test Results */}
            {testResults.length > 0 && <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
                <h3 className="font-semibold mb-4">Test Results</h3>
                <div className="space-y-2">
                  {testResults.map((result, idx) => <div key={idx} className={`p-3 rounded-lg text-sm ${result.includes('✓') ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#ef4444]/10 text-[#ef4444]'}`}>
                      {result}
                    </div>)}
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
}
