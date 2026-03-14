const Project = require("./projects.model");

exports.createProject = async (data) => {
  return await Project.create(data);
};

exports.getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 });
};

exports.getProjectById = async (id) => {
  return await Project.findById(id);
};

exports.updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};
