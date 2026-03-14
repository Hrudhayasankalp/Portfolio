const Education = require("./education.model");

exports.getAll = () => Education.find().sort({ startYear: -1 });
exports.create = (data) => Education.create(data);
exports.remove = (id) => Education.findByIdAndDelete(id);
