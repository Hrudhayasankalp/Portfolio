import { motion } from "framer-motion";

/**
 * Premium LeetCode Streak Panel component.
 * Showcases the current active coding streak with glowing micro-animations.
 */
const LeetCodeStreakPanel = ({ streak = 0, totalActiveDays = 0, username = "" }) => {
  // Determine streak encouragement message
  let streakMessage = "Start your coding session today to spark a streak!";
  let glowColor = "rgba(249, 115, 22, 0.15)"; // Soft orange glow
  let borderGlow = "hover:border-orange-500/30";

  if (streak >= 20) {
    streakMessage = "🔥 Elite Coding Streak! Incredible dedication and consistency!";
    glowColor = "rgba(239, 68, 68, 0.25)"; // Radiant red/orange glow
    borderGlow = "hover:border-red-500/40 hover:shadow-red-500/10";
  } else if (streak >= 10) {
    streakMessage = "⚡ Impressive Streak! You're building solid momentum!";
    glowColor = "rgba(245, 158, 11, 0.2)"; // Amber glow
    borderGlow = "hover:border-amber-500/30 hover:shadow-amber-500/5";
  } else if (streak > 0) {
    streakMessage = "🚀 Coding streak active! Keep going, consistency is key!";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`glass bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-orange-950/15 border border-orange-500/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-500 ${borderGlow}`}
      style={{ boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 40px ${glowColor}` }}
    >
      {/* Background glowing sphere */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-800/60">
          <div>
            <h3 className="text-xl font-black text-white">Consistency Dashboard</h3>
            <p className="text-xs text-gray-400 mt-0.5">LeetCode Streak Stats</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold uppercase tracking-wider">
            STREAK ACTIVE
          </span>
        </div>

        {/* Big Flame Display */}
        <div className="flex flex-col md:flex-row items-center gap-6 py-2">
          {/* Flame Icon with Pulse Animation */}
          <div className="relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr from-orange-600/15 to-red-600/5 border border-orange-500/20 shadow-inner flex-shrink-0">
            {/* Soft pulsing back-glow */}
            <span className="absolute animate-ping inline-flex h-16 w-16 rounded-full bg-orange-500/20 opacity-75"></span>
            
            {/* SVG Flame */}
            <svg 
              className="w-16 h-16 text-orange-500 filter drop-shadow-[0_0_12px_rgba(249,115,22,0.8)] animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div className="space-y-2 text-center md:text-left flex-grow">
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-white leading-none">
                {streak}
              </span>
              <span className="text-lg md:text-xl font-bold text-orange-400">
                {streak === 1 ? "Day Streak" : "Day Coding Streak"}
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              {streakMessage}
            </p>
          </div>
        </div>

        {/* Key Metrics grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Active Days</p>
              <p className="text-base font-extrabold text-white mt-0.5">{totalActiveDays} Days</p>
            </div>
          </div>
          <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target Consistency</p>
              <p className="text-base font-extrabold text-white mt-0.5">100% Daily</p>
            </div>
          </div>
        </div>

        {/* Consistency Milestone timeline */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Milestone Progress</span>
            <span>{streak} / 30 Days</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50 p-[2px]">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(249,115,22,0.6)]"
              style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-500">
            <span>0D</span>
            <span>10D</span>
            <span>20D</span>
            <span>30D 🏆</span>
          </div>
        </div>
      </div>

      {/* Footer / Quote */}
      <div className="text-[11px] text-gray-500 font-semibold italic text-center pt-6 border-t border-gray-800/40 mt-6 select-none">
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
      </div>
    </motion.div>
  );
};

export default LeetCodeStreakPanel;
