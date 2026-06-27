import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, ArrowLeft, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { uploadResumeAPI, getResumeScoreAPI } from '../../api/api';
import toast from 'react-hot-toast';

export function ATSAnalyzer() {
  const navigate = useNavigate();
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState(null);

  const fetchScore = async () => {
    try {
      const res = await getResumeScoreAPI();
      if (res?.data?.stats) {
        setData(res.data);
        setAnalyzed(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await uploadResumeAPI(fd);
      toast.success("Resume uploaded successfully!");
      fetchScore();
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const atsScore = data?.stats?.atsScore || 0;
  const scoreData = [{ name: 'Score', value: atsScore, fill: '#1f7af9' }];

  const keywordMatches = [
    ...(data?.resumeInsights?.matchedSkills || []).map(skill => ({ keyword: skill, status: 'found', count: 1 })),
    ...(data?.resumeInsights?.missingSkills || []).map(skill => ({ keyword: skill, status: 'missing', count: 0 }))
  ];

  const suggestions = (data?.resumeInsights?.suggestions || []).map(s => ({
    title: s,
    description: '',
    priority: 'medium'
  }));

  if (loading) return <div className="min-h-screen bg-[#0f1723] text-white flex justify-center items-center">Loading...</div>;
  return <div className="min-h-screen bg-[#0f1723] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/candidate/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ATS Resume Analyzer</h1>
          <p className="text-gray-400">Get instant feedback on your resume's ATS compatibility</p>
        </div>

        {!analyzed ? <div className="p-12 bg-white/5 backdrop-blur border border-white/10 rounded-3xl text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-[#1f7af9]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
              <p className="text-gray-400 mb-8">Our AI will analyze your resume for ATS compatibility and provide actionable feedback</p>
              <label className="block border-2 border-dashed border-white/20 rounded-2xl p-12 hover:border-[#1f7af9]/50 transition-all cursor-pointer group">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-[#1f7af9] transition-colors" />
                <p className="text-lg mb-2">{uploading ? "Uploading..." : "Click to upload or drag and drop"}</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div> : <div className="space-y-6">
            {/* ATS Score */}
            <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Your ATS Score</h2>
                  <p className="text-gray-400 mb-4">Based on industry standards and keyword analysis</p>
                  <div className="flex items-center gap-2 text-[#10b981]">
                    <TrendingUp className="w-5 h-5" />
                    <span>Good compatibility - Above average</span>
                  </div>
                </div>
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart data={scoreData} startAngle={90} endAngle={-270} innerRadius="60%" outerRadius="100%">
                      <RadialBar dataKey="value" cornerRadius={20} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-32">
                    <div className="text-6xl font-black">{atsScore}</div>
                    <div className="text-gray-400">out of 100</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Keyword Analysis */}
              <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Keyword Match</h3>
                <div className="space-y-3">
                  {keywordMatches.map(item => <div key={item.keyword} className={`p-4 rounded-xl border ${item.status === 'found' ? 'bg-[#10b981]/10 border-[#10b981]/30' : 'bg-[#ef4444]/10 border-[#ef4444]/30'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.status === 'found' ? <CheckCircle className="w-5 h-5 text-[#10b981]" /> : <AlertCircle className="w-5 h-5 text-[#ef4444]" />}
                          <span className="font-semibold">{item.keyword}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.status === 'found' ? <>
                              <span className="text-sm text-gray-400">Found</span>
                              <span className="px-2 py-1 bg-[#10b981]/20 rounded text-[#10b981] text-sm font-semibold">
                                {item.count}x
                              </span>
                            </> : <span className="text-sm text-[#ef4444]">Missing</span>}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Improvement Suggestions</h3>
                <div className="space-y-4">
                  {suggestions.map((suggestion, idx) => <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#1f7af9]/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${suggestion.priority === 'high' ? 'bg-[#ef4444]/20 text-[#ef4444]' : suggestion.priority === 'medium' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'bg-[#10b981]/20 text-[#10b981]'}`}>
                          {suggestion.priority.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{suggestion.title}</p>
                          <p className="text-sm text-gray-400">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={() => setAnalyzed(false)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                Upload New Resume
              </button>
            </div>
          </div>}
      </div>
    </div>;
}
