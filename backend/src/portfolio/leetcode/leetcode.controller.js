const leetcodeService = require("./leetcode.service");
const Profile = require("../profile/profile.model");

exports.getStats = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    const username = profile?.leetcodeUsername || "sankalp_nrnh";
    
    console.log(`📊 Fetching LeetCode stats for user: ${username}`);
    const stats = await leetcodeService.getLeetCodeStats(username);
    
    res.json(stats);
  } catch (err) {
    console.error("Error in LeetCode controller:", err);
    err.statusCode = 500;
    next(err);
  }
};
