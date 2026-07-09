import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink, BookOpen, Award, AlertCircle, RefreshCw } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { getSkillGapAnalysisAPI } from '../../api/api';

/**
 * @typedef {import('../../types/skillGap.ts').SkillGapAnalysisResponse} SkillGapAnalysisResponse
 */

export function SkillGapAnalysis() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getSkillGapAnalysisAPI();
      console.log("API Response:", res);
      
      if (res?.code === 1) {
        setData(res.data);
      } else {
        throw new Error(res?.message || 'Failed to fetch skill gap analysis');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-10 h-10 animate-spin text-[#3b82f6]" />
            <p className="text-gray-400">Loading your skill gap analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white p-6">
        <div className="max-w-md w-full bg-[#161b22] border border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <AlertCircle className="w-12 h-12 text-[#f59e0b] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] transition-colors rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Prepare radar chart data
  const radarData = data.requiredSkills.map(reqSkill => {
    const matchingGap = data.gapSkills.find(g => g.skill === reqSkill.skill);
    const matchingStrong = data.strongSkills.find(s => s.skill === reqSkill.skill);
    const yours = matchingGap ? matchingGap.yourLevel : (matchingStrong ? matchingStrong.yourLevel : 0);

    return {
      skill: reqSkill.skill,
      required: reqSkill.requiredLevel,
      yours: yours
    };
  });

  const handleCourseClick = (skill) => {
    const searchQuery = encodeURIComponent(`${skill} full course tutorial`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/candidate/dashboard')} 
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Skill Gap Analysis</h1>
          <p className="text-gray-400">Identify areas for improvement and get personalized learning paths</p>
        </div>

        {/* Skills Overview */}
        <div className="p-8 bg-[#161b22] border border-white/10 rounded-3xl mb-6 shadow-xl shadow-black/20">
          <h2 className="text-2xl font-bold mb-6">Skills Overview</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Radar Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="skill" stroke="#8b92a8" />
                  <PolarRadiusAxis stroke="#8b92a8" domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Required" dataKey="required" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  <Radar name="Your Level" dataKey="yours" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Cards */}
            <div>
              <div className="space-y-4">
                <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-[#10b981]" />
                    <span className="font-semibold text-[#10b981]">Strong Skills</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {data.strongSkills.length > 0 
                      ? data.strongSkills.map(s => s.skill).join(', ')
                      : 'No strong skills yet.'}
                  </p>
                </div>

                <div className="p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-[#f59e0b]" />
                    <span className="font-semibold text-[#f59e0b]">Skills to Improve</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {data.gapSkills.length > 0 
                      ? data.gapSkills.map(s => s.skill).join(', ')
                      : 'No significant skill gaps!'}
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-4xl font-bold mb-1 text-[#3b82f6]">{data.overallAlignmentPercent}%</div>
                  <p className="text-sm text-gray-400">Overall Skill Alignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gap Comparison */}
        <div className="p-8 bg-[#161b22] border border-white/10 rounded-3xl mb-6 shadow-xl shadow-black/20">
          <h3 className="text-2xl font-bold mb-6">Skill Gap Breakdown</h3>
          {radarData.length === 0 ? (
             <div className="p-6 bg-white/5 rounded-2xl text-center text-gray-400">
                No skill data available. Please set up your preferences or upload a resume.
             </div>
          ) : (
          <div className="space-y-4">
            {radarData.map(skill => {
              const gap = skill.required - skill.yours;
              const hasGap = gap > 0;
              
              // Map 0-10 level to 0-100% for progress bars
              const requiredPercent = (skill.required / 10) * 100;
              const yoursPercent = (skill.yours / 10) * 100;

              return (
                <div key={skill.skill} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-lg">{skill.skill}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${hasGap ? 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10' : 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10'}`}>
                      {hasGap ? `${gap} points gap` : 'Exceeds requirement'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-400">Required Level</p>
                        <p className="text-sm text-[#f59e0b] font-medium">{skill.required}/10</p>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#f59e0b] rounded-full" 
                          style={{ width: `${requiredPercent}%` }} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-400">Your Level</p>
                        <p className="text-sm text-[#3b82f6] font-medium">{skill.yours}/10</p>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#3b82f6] rounded-full" 
                          style={{ width: `${yoursPercent}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Recommended Courses */}
        <div className="p-8 bg-[#161b22] border border-white/10 rounded-3xl shadow-xl shadow-black/20">
          <h3 className="text-2xl font-bold mb-6">Recommended Learning Resources</h3>
          {data.learningResources.length === 0 ? (
            <div className="p-6 bg-white/5 rounded-2xl text-center text-gray-400">
              No learning resources needed at this time. You're fully aligned!
            </div>
          ) : (
            <div className="space-y-4">
              {data.learningResources.map((rec, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#3b82f6]/50 hover:bg-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#3b82f6]/20 border border-[#3b82f6]/40 rounded-lg text-xs font-semibold text-[#3b82f6]">
                        {rec.skill}
                      </span>
                      <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-md">{rec.category}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{rec.title}</h4>
                    <div className="flex items-center gap-5 text-sm text-gray-400">
                      <span className="flex items-center gap-1">⏱ {rec.durationHours} hours</span>
                      <span className="flex items-center gap-1 text-[#f59e0b]">
                        ⭐ {rec.rating}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (rec.youtubeVideoId) {
                        window.open(`https://www.youtube.com/watch?v=${rec.youtubeVideoId}`, '_blank', 'noopener,noreferrer');
                      } else {
                        handleCourseClick(rec.skill);
                      }
                    }}
                    className="w-full md:w-auto px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    View Course
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
