import { useState, useEffect } from "react";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "", // will be comma separated
    liveUrl: "",
    githubUrl: "",
    image: ""
  });

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map(item => item.trim()).filter(Boolean)
      };

      if (isEditing) {
        await api.put(`/projects/${currentId}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      alert("Error saving project");
    }
  };

  const editProject = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      image: project.image || ""
    });
    setIsEditing(true);
    setCurrentId(project._id);
    document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert("Error deleting project");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", techStack: "", liveUrl: "", githubUrl: "", image: ""
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Project" : "Add Project"}</h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
              <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Node, MongoDB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
              <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="image" value={formData.image} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
              {isEditing ? "Update Project" : "Save Project"}
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
        <h3 className="text-xl font-bold text-gray-800 mb-6">Existing Projects</h3>
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((proj) => (
              <div key={proj._id} className="flex flex-col md:flex-row gap-6 p-4 border border-gray-200 rounded-xl hover:shadow-md transition bg-gray-50/50">
                {proj.image && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{proj.title}</h4>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => editProject(proj)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex gap-1 items-center">
                      <span>✏️</span> Edit
                    </button>
                    <button onClick={() => deleteProject(proj._id)} className="text-red-600 hover:text-red-800 text-sm font-medium flex gap-1 items-center">
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

export default Projects;