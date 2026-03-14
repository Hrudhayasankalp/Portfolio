import { useState, useEffect } from "react";
import api from "../services/api";

function Education() {
  const [educationList, setEducationList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    grade: ""
  });

  const fetchEducation = async () => {
    try {
      const res = await api.get("/education");
      setEducationList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startYear: parseInt(formData.startYear),
        endYear: formData.endYear ? parseInt(formData.endYear) : null
      };

      if (isEditing) {
        await api.put(`/education/${currentId}`, payload);
      } else {
        await api.post("/education", payload);
      }
      resetForm();
      fetchEducation();
    } catch (err) {
      alert("Error saving education");
    }
  };

  const editEducation = (edu) => {
    setFormData({
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      startYear: edu.startYear ? edu.startYear.toString() : "",
      endYear: edu.endYear ? edu.endYear.toString() : "",
      grade: edu.grade || ""
    });
    setIsEditing(true);
    setCurrentId(edu._id);
    document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEducation = async (id) => {
    if (!window.confirm("Delete this education record?")) return;
    try {
      await api.delete(`/education/${id}`);
      fetchEducation();
    } catch (err) {
      alert("Error deleting education");
    }
  };

  const resetForm = () => {
    setFormData({ institution: "", degree: "", field: "", startYear: "", endYear: "", grade: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Education" : "Add Education"}</h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input type="text" name="institution" value={formData.institution} onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} required placeholder="e.g. Bachelor of Science"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              <input type="text" name="field" value={formData.field} onChange={handleChange} required placeholder="e.g. Computer Science"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade / GPA</label>
              <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g. 3.8/4.0 or First Class"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
              <input type="number" name="startYear" value={formData.startYear} onChange={handleChange} required min="1900" max="2100" placeholder="YYYY"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
              <input type="number" name="endYear" value={formData.endYear} onChange={handleChange} min="1900" max="2100" placeholder="YYYY (Leave empty if present)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button type="submit" className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition">
              {isEditing ? "Update Education" : "Save Education"}
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
        <h3 className="text-xl font-bold text-gray-800 mb-6">Academic History</h3>
        {educationList.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">No education records found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationList.map((edu) => (
              <div key={edu._id} className="p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{edu.institution}</h4>
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </span>
                </div>
                <p className="font-medium text-gray-800 text-lg">{edu.degree}</p>
                <p className="text-gray-600 font-medium">{edu.field}</p>
                {edu.grade && (
                  <p className="mt-2 text-sm text-gray-500">
                    <span className="font-semibold text-gray-600">Grade:</span> {edu.grade}
                  </p>
                )}
                
                <div className="flex gap-4 mt-6">
                  <button onClick={() => editEducation(edu)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex gap-1 items-center">
                    <span>✏️</span> Edit
                  </button>
                  <button onClick={() => deleteEducation(edu._id)} className="text-red-600 hover:text-red-800 text-sm font-medium flex gap-1 items-center">
                    <span>🗑️</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Education;