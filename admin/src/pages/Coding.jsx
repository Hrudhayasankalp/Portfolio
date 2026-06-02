import { useState, useEffect } from "react";
import api from "../services/api";

function Coding() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    githubUsername: "",
    github: "",
    leetcodeUsername: "",
    geeksforgeeksUsername: "",
    geeksforgeeks: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data) {
        setProfile(res.data);
        setFormData({
          githubUsername: res.data.githubUsername || "",
          github: res.data.github || "",
          leetcodeUsername: res.data.leetcodeUsername || "",
          geeksforgeeksUsername: res.data.geeksforgeeksUsername || "",
          geeksforgeeks: res.data.geeksforgeeks || ""
        });
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (profile && profile._id) {
        // Update profile
        await api.put(`/profile`, formData);
      } else {
        // Create new profile with these values (and default others)
        await api.post("/profile", {
          name: "Portfolio Owner",
          role: "Developer",
          ...formData
        });
      }
      alert("Coding profile settings saved successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Error saving coding profile settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Coding Profiles</h2>
          <p className="text-gray-500 text-sm mt-1">Connect and configure your LeetCode, GitHub, and GeeksforGeeks developer profiles.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* GitHub Connection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="text-xl">🐙</span> GitHub Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Username</label>
                <input
                  type="text"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleChange}
                  placeholder="e.g. Hrudhayasankalp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">Used to pull contribution heatmaps and commit stats.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile Link</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="e.g. https://github.com/Hrudhayasankalp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">The profile link used for "Open GitHub Profile" buttons.</p>
              </div>
            </div>
          </div>

          {/* LeetCode Connection */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="text-xl text-yellow-500">⚡</span> LeetCode Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LeetCode Username</label>
                <input
                  type="text"
                  name="leetcodeUsername"
                  value={formData.leetcodeUsername}
                  onChange={handleChange}
                  placeholder="e.g. sankalp_nrnh"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">Used to pull question counts, difficulty metrics, streaks, and ranking stats.</p>
              </div>
            </div>
          </div>

          {/* GeeksforGeeks Connection */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="text-xl text-green-600">🟢</span> GeeksforGeeks Integration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GeeksforGeeks Username</label>
                <input
                  type="text"
                  name="geeksforgeeksUsername"
                  value={formData.geeksforgeeksUsername}
                  onChange={handleChange}
                  placeholder="e.g. geeks_sankalp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">Your GeeksforGeeks handle/username.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GeeksforGeeks Profile Link</label>
                <input
                  type="url"
                  name="geeksforgeeks"
                  value={formData.geeksforgeeks}
                  onChange={handleChange}
                  placeholder="e.g. https://www.geeksforgeeks.org/user/geeks_sankalp/"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">The link that will connect your GeeksforGeeks CTA button.</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 shadow-sm transition-colors duration-200"
            >
              {isLoading ? "Saving Settings..." : "Save Connection Settings"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Coding;
