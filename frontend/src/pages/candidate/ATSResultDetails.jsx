import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, Award, Target, Briefcase, FileText, X } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export function ATSResultDetails({ parsedData, onClose }) {
  // Parsing logic with fallbacks to ensure dummy data shows up perfectly if backend omits it
  const jdMatchStr = parsedData["JD Match"] || parsedData["jd_match"] || parsedData["ats_score"] || "85%";
  const atsScore = typeof jdMatchStr === 'number' ? jdMatchStr : parseInt(String(jdMatchStr).replace('%', ''), 10) || 85;
  
  const matchedSkills = parsedData["Matched Skills"] || parsedData["matched_skills"] || parsedData.matchedSkills || ["React.js", "Node.js", "Express.js", "MySQL", "REST API", "Git", "GitHub"];
  const missingSkills = parsedData.MissingSkills || parsedData["missing_skills"] || parsedData.missingSkills || ["Automated Testing", "Cloud Infrastructure Management"];
  
  const skillMatchScore = Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length || 1)) * 100);
  
  const experienceLvl = parsedData.Experience || parsedData.experience || "Junior";
  const experienceYears = parsedData.YearsOfExperience || parsedData.years_of_experience || "1 Year";
  const experienceMatchScore = parsedData.ExperienceMatch || parsedData.experience_match || 75;
  
  const strengths = parsedData.Strengths || parsedData.strengths || [
    "Strong technical skills in frontend and backend development", 
    "Experience with modern frameworks and libraries"
  ];
  const weaknesses = parsedData.Weaknesses || parsedData.weaknesses || [
    "Limited experience in automated testing", 
    "No experience in cloud infrastructure management"
  ];
  const suggestions = parsedData.Suggestions || parsedData.suggestions || [
    "Gain experience in automated testing frameworks", 
    "Familiarize with cloud services and deployment processes"
  ];

  const summary = parsedData.Summary || parsedData["Profile Summary"] || parsedData.summary || 
    "Your resume demonstrates solid full-stack development skills and aligns well with the provided Job Description. Strengthening your knowledge of automated testing and cloud technologies will significantly improve your ATS score and increase your chances of shortlisting.";

  const scoreData = [{ name: 'Score', value: atsScore, fill: atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444' }];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f1723] text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6 pb-24">
        
        {/* Header */}
        <div className="flex items-center justify-between mt-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">ATS Analysis Dashboard</h1>
            <p className="text-gray-400 mt-1">Detailed breakdown of your resume match</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group">
            <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-xl text-gray-300 font-semibold mb-2">JD Match Score</h2>
                <div className="flex items-center gap-2 text-[#10b981] text-xl font-bold mb-4">
                  <TrendingUp className="w-6 h-6" />
                  <span>{atsScore >= 80 ? 'Excellent Match' : atsScore >= 60 ? 'Good Match' : 'Needs Improvement'}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{summary}</p>
              </div>
              <div className="w-48 h-48 flex-shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={scoreData} startAngle={90} endAngle={-270} innerRadius="75%" outerRadius="100%">
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(255,255,255,0.05)' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black">{atsScore}%</span>
                </div>
              </div>
            </div>
            {/* Decorative background shapes */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1f7af9] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#bc13fe] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
          </div>

          {/* Experience Card */}
          <div className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl flex flex-col justify-center relative overflow-hidden group hover:border-[#f59e0b]/50 transition-colors">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 text-gray-400">
                <Briefcase className="w-6 h-6 text-[#f59e0b]" />
                <span className="font-semibold text-lg text-white">Experience Analysis</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Level</p>
                  <p className="text-2xl font-bold">{experienceLvl}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Years</p>
                  <p className="text-2xl font-bold">{experienceYears}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience Match Score</span>
                  <span className="text-[#f59e0b] font-bold text-lg">{experienceMatchScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full" style={{ width: `${experienceMatchScore}%` }} />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/10 blur-3xl group-hover:bg-[#f59e0b]/20 transition-colors"></div>
          </div>
        </motion.div>

        {/* Skills Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl group hover:border-[#1f7af9]/30 transition-colors relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Target className="w-7 h-7 text-[#1f7af9]" />
                Skills Analysis
              </h3>
              <div className="md:text-right w-full md:w-72">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Skill Match Score</span>
                  <span className="font-bold text-[#1f7af9] text-lg">{skillMatchScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1f7af9] to-[#3b82f6] rounded-full" style={{ width: `${skillMatchScore}%` }} />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="font-semibold text-lg text-white">Matched Skills</h4>
                  <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] text-xs font-bold rounded-full">{matchedSkills.length}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {matchedSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#10b981]/20 transition-colors cursor-default">
                      <CheckCircle2 className="w-4 h-4" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="font-semibold text-lg text-white">Missing Skills</h4>
                  <span className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] text-xs font-bold rounded-full">{missingSkills.length}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {missingSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#ef4444]/20 transition-colors cursor-default">
                      <XCircle className="w-4 h-4" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#1f7af9]/5 blur-3xl"></div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-white/5 backdrop-blur border border-[#10b981]/20 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-7 h-7 text-[#10b981]" />
              <h3 className="text-xl font-bold">Strengths</h3>
              <span className="px-2.5 py-1 bg-[#10b981]/20 text-[#10b981] text-xs font-bold rounded-full ml-auto">{strengths.length}</span>
            </div>
            <div className="space-y-4">
              {strengths.map((str, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl hover:bg-[#10b981]/10 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-[#10b981] flex-shrink-0" />
                  <p className="text-sm text-gray-200 leading-relaxed">{str}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white/5 backdrop-blur border border-[#f59e0b]/20 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-7 h-7 text-[#f59e0b]" />
              <h3 className="text-xl font-bold">Weaknesses</h3>
              <span className="px-2.5 py-1 bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold rounded-full ml-auto">{weaknesses.length}</span>
            </div>
            <div className="space-y-4">
              {weaknesses.map((weak, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl hover:bg-[#f59e0b]/10 transition-colors">
                  <AlertTriangle className="w-6 h-6 text-[#f59e0b] flex-shrink-0" />
                  <p className="text-sm text-gray-200 leading-relaxed">{weak}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl mb-6 hover:border-white/20 transition-colors">
          <h3 className="text-2xl font-bold mb-8">Improvement Suggestions</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {suggestions.map((sug, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1f7af9]/20 to-[#bc13fe]/20 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-inner">
                  📌
                </div>
                <p className="text-sm text-gray-300 leading-relaxed pt-1">{sug}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="flex-1 py-5 bg-gradient-to-r from-[#1f7af9] to-[#bc13fe] rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(31,122,249,0.3)] transition-all flex items-center justify-center gap-2">
            <FileText className="w-6 h-6" />
            Download Report
          </button>
          <button onClick={onClose} className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 font-bold text-lg transition-all">
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
