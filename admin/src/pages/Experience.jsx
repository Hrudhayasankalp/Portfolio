import { useState, useEffect } from "react";
import api from "../services/api";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    technologies: ""
  });

  const fetchExperiences = async () => {
    try {
      const res = await api.get("/experience");
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies ? formData.technologies.split(",").map(item => item.trim()).filter(Boolean) : []
      };

      if (isEditing) {
        await api.put(`/experience/${currentId}`, payload);
      } else {
        await api.post("/experience", payload);
      }
      resetForm();
      fetchExperiences();
    } catch (err) {
      alert("Error saving experience");
    }
  };

  const editExperience = (exp) => {
    setFormData({
      company: exp.company,
      role: exp.role,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      technologies: exp.technologies ? exp.technologies.join(", ") : ""
    });
    setIsEditing(true);
    setCurrentId(exp._id);
    document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteExperience = async (id) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await api.delete(`/experience/${id}`);
      fetchExperiences();
    } catch (err) {
      alert("Error deleting experience");
    }
  };

  const resetForm = () => {
    setFormData({ company: "", role: "", description: "", startDate: "", endDate: "", technologies: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Experience" : "Add Experience"}</h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="text" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="e.g. Jan 2023" required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="text" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="e.g. Present or Mar 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
              <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Tailwind"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"></textarea>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button type="submit" className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition">
              {isEditing ? "Update Experience" : "Save Experience"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Work History</h3>
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">No experience records found.</p>
        ) : (
          <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
            {experiences.map((exp) => (
              <div key={exp._id} className="relative pl-8">
                <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-yellow-100 border-4 border-white flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                </span>
                
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-y-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{exp.role}</h4>
                      <p className="text-md text-yellow-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-3 whitespace-pre-wrap">{exp.description}</p>
                  
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                      {exp.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-md font-medium border border-yellow-100">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4 mt-4 pt-4">
                    <button onClick={() => editExperience(exp)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex gap-1 items-center">
                      <span>✏️</span> Edit
                    </button>
                    <button onClick={() => deleteExperience(exp._id)} className="text-red-600 hover:text-red-800 text-sm font-medium flex gap-1 items-center">
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Experience;