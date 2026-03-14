const Skill = require("./skills.model");

exports.getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.createSkill = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // Check if skill already exists (case-insensitive)
    const existingSkill = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSkill) {
      const e = new Error("Skill already exists");
      e.statusCode = 400;
      throw e;
    }

    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) {
      const e = new Error("Skill not found");
      e.statusCode = 404;
      throw e;
    }
    res.json(skill);
  } catch (err) {
    next(err);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      const e = new Error("Skill not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ message: "Skill deleted" });
  } catch (err) {
    next(err);
  }
};
