import { useState, useEffect } from "react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    github: "",
    linkedin: "",
    website: "",
    avatar: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data) {
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          role: res.data.role || "",
          bio: res.data.bio || "",
          email: res.data.email || "",
          github: res.data.github || "",
          linkedin: res.data.linkedin || "",
          website: res.data.website || "",
          avatar: res.data.avatar || ""
        });
      }
    } catch (err) {
      console.error(err);
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
    try {
      if (profile && profile._id) {
        await api.put(`/profile`, formData);
      } else {
        await api.post("/profile", formData);
      }
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information and social links.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        {!isEditing && profile ? (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-white shadow-lg mx-auto md:mx-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  👤
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{profile.name}</h3>
                <p className="text-xl text-blue-600 font-medium mt-1">{profile.role}</p>
              </div>
              <p className="text-gray-600 leading-relaxed max-w-3xl">{profile.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold text-gray-800 w-24">Email:</span>
                  <a href={`mailto:${profile.email}`} className="text-blue-500 hover:underline">{profile.email || "N/A"}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold text-gray-800 w-24">Website:</span>
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{profile.website || "N/A"}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold text-gray-800 w-24">GitHub:</span>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{profile.github || "N/A"}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold text-gray-800 w-24">LinkedIn:</span>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{profile.linkedin || "N/A"}</a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Role</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image URL</label>
                <input type="url" name="avatar" value={formData.avatar} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <input type="url" name="github" value={formData.github} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                Save Profile
              </button>
              {profile && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
