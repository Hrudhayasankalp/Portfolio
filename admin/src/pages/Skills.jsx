import { useState, useEffect } from "react";
import api from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addSkill = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await api.post("/skills", { 
        name: name.trim()
      });
      setName("");
      fetchSkills();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding skill");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (err) {
      alert("Error deleting skill");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Skills</h2>
          <p className="text-gray-500 text-sm mt-1">Add or remove your technical skills.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={addSkill} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. React, Node.js"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 shadow-sm"
          >
            {isLoading ? "Adding..." : "Add Skill"}
          </button>
        </form>

        {skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No skills added yet. Add your first skill above.
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <li
                key={skill._id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span className="font-semibold text-gray-800">{skill.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteSkill(skill._id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ml-2 mt-[-4px]"
                  title="Delete skill"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Skills;