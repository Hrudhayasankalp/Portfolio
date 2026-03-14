const Skill = require("./skills.model");

exports.createSkill = async (data) => {
  return await Skill.create(data);
};

exports.getAllSkills = async () => {
  return await Skill.find().sort({ createdAt: -1 });
};

exports.deleteSkill = async (id) => {
  return await Skill.findByIdAndDelete(id);
};
