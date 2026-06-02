import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const DifficultyRing = ({ difficulty, solved, total, colorClass, gradientId, fromColor, toColor, glowColor }) => {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius; // ~226.2
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="flex flex-col items-center p-5 bg-gray-950/40 border border-gray-800/60 rounded-2xl shadow-lg transition-all duration-300 hover:border-gray-700/40 group relative overflow-hidden flex-grow"
    >
      {/* Glow highlight in background */}
      <div 
        className="absolute -top-12 -left-12 w-24 h-24 rounded-full blur-[40px] opacity-10 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none"
        style={{ backgroundColor: fromColor }}
      ></div>

      {/* SVG Container */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#111827"
            strokeWidth="8"
            fill="transparent"
            className="opacity-70"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
          />
        </svg>
        {/* Text inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pt-0.5">
          <span className="text-xl font-extrabold text-white leading-none">{solved}</span>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">/ {total}</span>
        </div>
      </div>
      
      {/* Label under circle */}
      <span className={`mt-4 px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border ${colorClass}`}>
        {difficulty}
      </span>
      {/* Percentage label */}
      <span className="text-[10px] text-gray-500 font-bold mt-2">
        {percentage.toFixed(1)}% Solved
      </span>
    </motion.div>
  );
};

const Coding = () => {
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [lcLoading, setLcLoading] = useState(true);
  const [ghLoading, setGhLoading] = useState(true);
  const [lcError, setLcError] = useState(false);
  const [ghError, setGhError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile settings", err);
      }
    };
    fetchProfile();

    const fetchLeetcode = async () => {
      try {
        const res = await api.get("/leetcode/stats");
        setLeetcodeStats(res.data);
      } catch (err) {
        console.error("Failed to fetch LeetCode stats", err);
        setLcError(true);
      } finally {
        setLcLoading(false);
      }
    };
    fetchLeetcode();

    const fetchGithub = async () => {
      try {
        const res = await api.get("/github/stats");
        setGithubStats(res.data);
      } catch (err) {
        console.error("Failed to fetch GitHub stats", err);
        setGhError(true);
      } finally {
        setGhLoading(false);
      }
    };
    fetchGithub();
  }, []);

  // Helper to render months labels dynamically based on calendar data
  const renderMonths = (calendarData) => {
    if (!calendarData || calendarData.length === 0) return null;
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Group days by columns of 7 days
    const totalCols = Math.ceil(calendarData.length / 7);
    const months = [];
    let lastMonth = -1;
    
    for (let c = 0; c < totalCols; c++) {
      const dayIdx = c * 7;
      if (dayIdx >= calendarData.length) break;
      
      const day = calendarData[dayIdx];
      // Timezone-safe month extraction: date format is YYYY-MM-DD
      const dateParts = day.date.split("-");
      if (dateParts.length < 2) continue;
      const monthVal = parseInt(dateParts[1], 10) - 1; // 0-indexed
      
      if (monthVal !== lastMonth) {
        months.push({
          name: monthNames[monthVal],
          colIndex: c
        });
        lastMonth = monthVal;
      }
    }

    return (
      <div className="flex text-[11px] text-gray-500 font-bold mt-2 relative h-4 w-full select-none">
        {months.map((m, i) => {
          // Horizontal alignment based on the column index relative to total columns
          const pct = (m.colIndex / totalCols) * 100;
          return (
            <span 
              key={i} 
              className="absolute transform -translate-x-1/2"
              style={{ left: `${Math.min(Math.max(pct, 2), 95)}%` }}
            >
              {m.name}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-12 min-h-[90vh] relative overflow-hidden px-4 md:px-8">
      {/* Background glowing blurred circles */}
      <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-orange-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="mb-16 text-center max-w-3xl mx-auto pt-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Coding <span className="text-gradient">Profiles</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-base md:text-xl px-4 max-w-xl mx-auto"
        >
          My live-updated coding performance activity and developer statistics synchronized directly from GitHub and LeetCode.
        </motion.p>
      </div>

      {/* Stacked Layout (one under the other - "down by down") */}
      <div className="space-y-16 max-w-6xl mx-auto mb-20">
        
        {/* ======================================================== */}
        {/* LEETCODE SECTION */}
        {/* ======================================================== */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-200 flex items-center gap-2 px-2">
            <span className="text-orange-500 text-3xl">⚡</span> LeetCode Analytics
          </h2>

          {lcLoading ? (
            // Loading Skeletons
            <div className="space-y-6">
              <div className="animate-pulse bg-gray-900/60 border border-gray-800 rounded-3xl h-60 w-full"></div>
              <div className="animate-pulse bg-gray-900/60 border border-gray-800 rounded-3xl h-48 w-full"></div>
            </div>
          ) : lcError || !leetcodeStats ? (
            <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 text-center text-gray-400 py-12 shadow-xl">
              ⚠️ LeetCode statistics are currently unreachable.
            </div>
          ) : (
            <div className="space-y-6">
              {/* LeetCode Header Stats & Category progress split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Solved Progress Overview (col-span-8) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="md:col-span-8 glass bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-orange-950/15 border border-orange-500/10 hover:border-orange-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-800/60 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/10 flex-shrink-0">
                          <img src={leetcodeStats.avatar} alt="LeetCode Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-white">{leetcodeStats.username}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-0.5">
                            Global Ranking: <span className="text-orange-400 font-bold">#{leetcodeStats.ranking.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Solved Tasks</span>
                        <p className="text-2xl font-black text-white mt-0.5 leading-none">
                          {leetcodeStats.totalSolved} <span className="text-sm text-gray-500 font-semibold">/ {leetcodeStats.totalQuestions}</span>
                        </p>
                      </div>
                    </div>

                    {/* Rounded Progress Indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <DifficultyRing
                        difficulty="Easy"
                        solved={leetcodeStats.easySolved}
                        total={leetcodeStats.easyTotal}
                        colorClass="text-emerald-400 bg-emerald-500/5 border-emerald-500/20 group-hover:border-emerald-500/40"
                        gradientId="easyGrad"
                        fromColor="#10b981"
                        toColor="#059669"
                        glowColor="rgba(16,185,129,0.4)"
                      />
                      <DifficultyRing
                        difficulty="Medium"
                        solved={leetcodeStats.mediumSolved}
                        total={leetcodeStats.mediumTotal}
                        colorClass="text-amber-400 bg-amber-500/5 border-amber-500/20 group-hover:border-amber-500/40"
                        gradientId="mediumGrad"
                        fromColor="#f59e0b"
                        toColor="#d97706"
                        glowColor="rgba(245,158,11,0.4)"
                      />
                      <DifficultyRing
                        difficulty="Hard"
                        solved={leetcodeStats.hardSolved}
                        total={leetcodeStats.hardTotal}
                        colorClass="text-rose-400 bg-rose-500/5 border-rose-500/20 group-hover:border-rose-500/40"
                        gradientId="hardGrad"
                        fromColor="#f43f5e"
                        toColor="#e11d48"
                        glowColor="rgba(244,63,94,0.4)"
                      />
                    </div>
                  </div>
                </motion.div>
                
                {/* Solved Summary Statistics (col-span-4) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="md:col-span-4 glass bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-orange-950/15 border border-orange-500/10 hover:border-orange-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-5 flex-grow flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-3 flex-grow">
                      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-3 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Streak ⚡</span>
                        <span className="text-lg font-black text-orange-400 mt-1">{leetcodeStats.streak} Days</span>
                      </div>
                      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-3 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Acceptance 🎯</span>
                        <span className="text-lg font-black text-orange-400 mt-1">{leetcodeStats.acceptanceRate}%</span>
                      </div>
                    </div>

                    <a 
                      href={`https://leetcode.com/${leetcodeStats.username}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 hover:border-transparent rounded-2xl text-xs font-bold transition-all duration-300 mt-4"
                    >
                      <span>Open LeetCode Profile</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* LeetCode Submission Calendar Panel (exactly like in the photo!) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl hover:border-orange-500/25 transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-800/40">
                  {/* Left Side */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-base md:text-lg font-bold text-gray-300">
                      <strong className="text-white font-extrabold text-lg md:text-xl">{leetcodeStats.totalSubmissions}</strong> submissions in the past one year
                    </span>
                    <span className="text-gray-500 cursor-help font-bold text-xs" title="Total submissions resolved from LeetCode activity calendar">
                      ⓘ
                    </span>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-400">
                    <span>
                      Total active days: <strong className="text-white">{leetcodeStats.totalActiveDays}</strong>
                    </span>
                    <span>
                      Max streak: <strong className="text-white">{leetcodeStats.maxStreak}</strong>
                    </span>
                    
                    {/* Custom LeetCode Selector Dropdown */}
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 text-white cursor-pointer select-none">
                      <span>Current</span>
                      <span className="text-[10px] text-gray-500">▼</span>
                    </div>
                  </div>
                </div>

                {/* Submissions Heatmap Grid (LeetCode Emerald Color Scale) */}
                <div className="pt-6">
                  <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
                    <div className="w-fit pr-4">
                      <div 
                        className="grid grid-flow-col grid-rows-7 gap-[4px] py-1 select-none"
                      >
                        {leetcodeStats.calendar.slice(-140).map((day, idx) => {
                          let levelColor = "bg-[#242424]"; // Solid LeetCode empty box
                          if (day.level === 1) levelColor = "bg-[#0e4429] border border-[#1b3a24]/10";
                          else if (day.level === 2) levelColor = "bg-[#006d32]";
                          else if (day.level === 3) levelColor = "bg-[#26a641]";
                          else if (day.level === 4) levelColor = "bg-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.6)]";

                          return (
                            <div
                              key={idx}
                              className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-300 cursor-help ${levelColor}`}
                              title={`${day.date}: ${day.count} submissions`}
                            ></div>
                          );
                        })}
                      </div>

                      {/* Months Timeline below the grid */}
                      {renderMonths(leetcodeStats.calendar.slice(-140))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* GITHUB SECTION */}
        {/* ======================================================== */}
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-black text-gray-200 flex items-center gap-2 px-2">
            <span className="text-blue-500 text-3xl">⚡</span> GitHub Analytics
          </h2>

          {ghLoading ? (
            // Loading Skeletons
            <div className="space-y-6">
              <div className="animate-pulse bg-gray-900/60 border border-gray-800 rounded-3xl h-60 w-full"></div>
              <div className="animate-pulse bg-gray-900/60 border border-gray-800 rounded-3xl h-48 w-full"></div>
            </div>
          ) : ghError || !githubStats ? (
            <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 text-center text-gray-400 py-12 shadow-xl">
              ⚠️ GitHub statistics are currently unreachable.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* GitHub Header Stats & Repository Languages split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Stats Overview card (col-span-7) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="md:col-span-7 glass bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-blue-950/15 border border-blue-500/10 hover:border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-gray-800/60 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/10 flex-shrink-0">
                          <img src={githubStats.avatar} alt="GitHub Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-white">{githubStats.name}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-0.5">
                            @{githubStats.username}
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col text-right text-xs text-gray-500 font-semibold gap-1">
                        <span>Followers: <strong className="text-white">{githubStats.followers}</strong></span>
                        <span>Following: <strong className="text-white">{githubStats.following}</strong></span>
                      </div>
                    </div>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-3 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Commits 📈</span>
                        <span className="text-base font-black text-blue-400 mt-1">{githubStats.totalCommits}</span>
                      </div>
                      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-3 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Stars ⭐</span>
                        <span className="text-base font-black text-blue-400 mt-1">{githubStats.totalStars}</span>
                      </div>
                      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-3 text-center flex flex-col justify-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Streak ⚡</span>
                        <span className="text-base font-black text-blue-400 mt-1">{githubStats.currentStreak} Days</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Languages breakdown (col-span-5) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="md:col-span-5 glass bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-blue-950/15 border border-blue-500/10 hover:border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3">
                        Primary Technologies
                      </div>

                      {githubStats.languages && githubStats.languages.length > 0 ? (
                        <div className="space-y-4">
                          {/* Split stacked bar */}
                          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden flex border border-gray-700/20">
                            {githubStats.languages.map((lang, idx) => {
                              const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];
                              return (
                                <div 
                                  key={idx}
                                  className={`${colors[idx % colors.length]} h-full`}
                                  style={{ width: `${lang.percentage}%` }}
                                  title={`${lang.language}: ${lang.percentage}%`}
                                ></div>
                              );
                            })}
                          </div>

                          {/* Legend list */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-semibold text-gray-400">
                            {githubStats.languages.map((lang, idx) => {
                              const dotColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];
                              return (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]}`}></span>
                                  <span>{lang.language}</span>
                                  <span className="text-gray-500 font-normal ml-auto">{lang.percentage}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Languages breakdown not available.</p>
                      )}
                    </div>

                    <a 
                      href={githubStats.profileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-transparent rounded-2xl text-xs font-bold transition-all duration-300 shadow-md"
                    >
                      <span>Open GitHub Profile</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* GitHub Contribution Calendar Panel (Full Width stacked) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl hover:border-blue-500/25 transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-800/40">
                  {/* Left Side */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-base md:text-lg font-bold text-gray-300">
                      <strong className="text-white font-extrabold text-lg md:text-xl">{githubStats.totalCommits}</strong> contributions in the last year
                    </span>
                    <span className="text-gray-500 cursor-help font-bold text-xs" title="Total public commits/PRs scraped from your profile page">
                      ⓘ
                    </span>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-400">
                    <span>
                      Active repositories: <strong className="text-white">{githubStats.publicRepos}</strong>
                    </span>
                    <span>
                      Longest streak: <strong className="text-white">{githubStats.longestStreak} Days</strong>
                    </span>
                    
                    {/* Styled Selector Dropdown */}
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 text-white cursor-pointer select-none">
                      <span>Current</span>
                      <span className="text-[10px] text-gray-500">▼</span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Calendar */}
                <div className="pt-6">
                  <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
                    <div className="w-fit pr-4">
                      <div 
                        className="grid grid-flow-col grid-rows-7 gap-[4px] py-1 select-none"
                      >
                        {githubStats.calendar.slice(-140).map((day, idx) => {
                          let levelColor = "bg-[#242424]"; // Solid GitHub empty box
                          if (day.level === 1) levelColor = "bg-[#0d2a58] border border-[#1b2b4a]/10";
                          else if (day.level === 2) levelColor = "bg-[#1e4eb8]";
                          else if (day.level === 3) levelColor = "bg-[#3b82f6]";
                          else if (day.level === 4) levelColor = "bg-[#60a5fa] shadow-[0_0_8px_rgba(96,165,250,0.6)]";

                          let contribText = "No contributions";
                          if (day.level === 1) contribText = "1-2 contributions";
                          else if (day.level === 2) contribText = "3-5 contributions";
                          else if (day.level === 3) contribText = "6-8 contributions";
                          else if (day.level === 4) contribText = "9+ contributions";

                          return (
                            <div
                              key={idx}
                              className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-300 cursor-help ${levelColor}`}
                              title={`${contribText} on ${day.date}`}
                            ></div>
                          );
                        })}
                      </div>

                      {/* Months Timeline below the grid */}
                      {renderMonths(githubStats.calendar.slice(-140))}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* GEEKFORGEEKS SECTION */}
        {/* ======================================================== */}
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-black text-gray-200 flex items-center gap-2 px-2">
            <span className="text-emerald-500 text-3xl">⚡</span> GeeksforGeeks Analytics
          </h2>

          {!profile || !profile.geeksforgeeksUsername ? (
            <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 text-center text-gray-400 py-12 shadow-xl">
              ⚠️ GeeksforGeeks profile is not connected. Use the admin panel to connect.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-emerald-950/15 border border-emerald-500/10 hover:border-emerald-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl hover:shadow-emerald-950/10 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left flex-grow">
                {/* Beautiful Green GFG Circle/Icon */}
                <div className="w-20 h-20 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 flex items-center justify-center flex-shrink-0 text-3xl text-emerald-400 font-extrabold select-none">
                  G
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                    <span className="text-2xl font-extrabold text-white">GeeksforGeeks Connection</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Username: <strong className="text-white text-base">@{profile.geeksforgeeksUsername}</strong>
                  </p>
                  <p className="text-gray-400 text-sm max-w-xl">
                    View complete algorithmic progress, solved problems, and contest ratings directly on GeeksforGeeks.
                  </p>
                </div>
              </div>

              <a 
                href={profile.geeksforgeeks || `https://www.geeksforgeeks.org/user/${profile.geeksforgeeksUsername}/`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent rounded-2xl text-sm font-bold transition-all duration-300 shadow-md whitespace-nowrap self-stretch md:self-center"
              >
                <span>Open GFG Profile</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coding;
