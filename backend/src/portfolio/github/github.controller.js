const githubService = require("./github.service");
const Profile = require("../profile/profile.model");

exports.getStats = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    const username = profile?.githubUsername || "Hrudhayasankalp";
    
    console.log(`📊 Fetching GitHub stats for user: ${username}`);
    const stats = await githubService.getGitHubStats(username);
    
    res.json(stats);
  } catch (err) {
    console.error("Error in GitHub controller:", err);
    err.statusCode = 500;
    next(err);
  }
};
