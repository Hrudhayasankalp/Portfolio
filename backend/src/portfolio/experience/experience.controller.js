const Experience = require("./experience.model");

exports.getExperience = async (req, res, next) => {
  try {
    const data = await Experience.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createExperience = async (req, res, next) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

exports.updateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) {
      const e = new Error("Experience not found");
      e.statusCode = 404;
      throw e;
    }
    res.json(exp);
  } catch (err) {
    next(err);
  }
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) {
      const e = new Error("Experience not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ message: "Experience deleted" });
  } catch (err) {
    next(err);
  }
};
