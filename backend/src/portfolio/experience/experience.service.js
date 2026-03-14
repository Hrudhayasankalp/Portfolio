const Experience = require("./experience.model");

exports.getAll = () => {
  return Experience.find().sort({ createdAt: -1 });
};

exports.create = (data) => {
  return Experience.create(data);
};

exports.remove = (id) => {
  return Experience.findByIdAndDelete(id);
};
