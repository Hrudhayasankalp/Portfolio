const axios = require("axios");

/**
 * Fetches user statistics and parses contribution data from GitHub.
 */
exports.getGitHubStats = async (username) => {
  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
  const contribUrl = `https://github.com/users/${username}/contributions`;

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  };

  try {
    // 1. Fetch Profile Info
    const profileRes = await axios.get(userUrl, { headers, timeout: 5000 });
    const profile = profileRes.data;

    // 2. Fetch Repos for Stars and Languages
    let repos = [];
    try {
      const reposRes = await axios.get(reposUrl, { headers, timeout: 5000 });
      repos = reposRes.data || [];
    } catch (reposErr) {
      console.warn("Failed to fetch GitHub repos for user:", username, reposErr.message);
    }

    // Aggregate Stars and Languages
    let totalStars = 0;
    const languageCounts = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    // Compute language percentages
    const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageCounts)
      .map(([language, count]) => ({
        language,
        count,
        percentage: totalLangRepos > 0 ? parseFloat(((count / totalLangRepos) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 languages

    // 3. Fetch Contribution calendar page and scrape
    let calendar = [];
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCommits = 0;

    try {
      const contribRes = await axios.get(contribUrl, { headers, timeout: 6000 });
      const html = contribRes.data;

      // Extract day boxes
      const dayRegex = /(?:<td|<rect)[^>]+data-date="([^"]+)"[^>]+data-level="([0-9])"/g;
      const days = [];
      let match;
      while ((match = dayRegex.exec(html)) !== null) {
        days.push({
          date: match[1],
          level: parseInt(match[2], 10)
        });
      }

      if (days.length > 0) {
        // Sort ascending to calculate streaks
        days.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Longest Streak calculation
        let tempStreak = 0;
        for (const day of days) {
          if (day.level > 0) {
            tempStreak++;
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
          } else {
            tempStreak = 0;
          }
        }

        // Current Streak calculation (backwards from the end)
        if (days[days.length - 1].level > 0) {
          for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].level > 0) currentStreak++;
            else break;
          }
        } else if (days.length > 1 && days[days.length - 2].level > 0) {
          for (let i = days.length - 2; i >= 0; i--) {
            if (days[i].level > 0) currentStreak++;
            else break;
          }
        }

        // Calendar filter: we only need the last 53 weeks (approx 371 days)
        // We will pass the full list of days sorted descending or ascending
        calendar = days;
      }

      // Scrape total commits in last year
      const totalMatch = html.match(/([0-9,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
      if (totalMatch) {
        totalCommits = parseInt(totalMatch[1].replace(/,/g, ""), 10);
      } else {
        // Fallback: sum levels as proxy if text parsing fails
        totalCommits = days.reduce((sum, d) => sum + (d.level > 0 ? d.level : 0), 0);
      }

    } catch (contribErr) {
      console.warn("Failed to scrape GitHub contributions for user:", username, contribErr.message);
      // Fallback streak/calendar values
      currentStreak = 0;
      longestStreak = 0;
      totalCommits = 0;
      calendar = [];
    }

    return {
      username: profile.login || username,
      avatar: profile.avatar_url || "https://github.com/identicons/default.png",
      name: profile.name || username,
      followers: profile.followers || 0,
      following: profile.following || 0,
      publicRepos: profile.public_repos || 0,
      totalStars,
      totalCommits,
      currentStreak,
      longestStreak,
      languages,
      calendar,
      profileUrl: profile.html_url || `https://github.com/${username}`
    };

  } catch (error) {
    console.error("Error fetching GitHub stats, loading mock fallback:", error.message);
    
    // Provide a beautiful fallback so that the page is robust in case of rate-limits
    return {
      username: username,
      avatar: "https://avatars.githubusercontent.com/u/103986060?v=4",
      name: "Hrudhaya Sankalp Putluru",
      followers: 8,
      following: 12,
      publicRepos: 6,
      totalStars: 4,
      totalCommits: 84,
      currentStreak: 2,
      longestStreak: 8,
      languages: [
        { language: "JavaScript", count: 4, percentage: 57.1 },
        { language: "HTML", count: 2, percentage: 28.6 },
        { language: "CSS", count: 1, percentage: 14.3 }
      ],
      calendar: generateMockCalendar(),
      profileUrl: `https://github.com/${username}`,
      isMock: true
    };
  }
};

// Generates a mock calendar grid for the last 365 days (levels 0-4) in UTC
function generateMockCalendar() {
  const days = [];
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const oneDayMs = 24 * 60 * 60 * 1000;
  for (let i = 365; i >= 0; i--) {
    const date = new Date(todayUTC - i * oneDayMs);
    // Random levels but matching a realistic sparse profile (heavy on weekends/weekdays)
    let level = 0;
    const rand = Math.random();
    if (rand > 0.85) level = 1;
    else if (rand > 0.93) level = 2;
    else if (rand > 0.97) level = 3;
    else if (rand > 0.99) level = 4;
    
    days.push({
      date: date.toISOString().split("T")[0],
      level
    });
  }
  return days;
}
