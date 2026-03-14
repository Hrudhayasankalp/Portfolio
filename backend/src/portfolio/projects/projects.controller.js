const Project = require("./projects.model");

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      const e = new Error("Project not found");
      e.statusCode = 404;
      throw e;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      const e = new Error("Project not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};
