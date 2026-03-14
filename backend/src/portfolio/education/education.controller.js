const Education = require("./education.model");

exports.getEducation = async (req, res, next) => {
  try {
    const data = await Education.find().sort({ startYear: -1 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createEducation = async (req, res, next) => {
  try {
    const edu = await Education.create(req.body);
    res.status(201).json(edu);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!edu) {
      const e = new Error("Education not found");
      e.statusCode = 404;
      throw e;
    }
    res.json(edu);
  } catch (err) {
    next(err);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) {
      const e = new Error("Education not found");
      e.statusCode = 404;
      throw e;
    }
    res.json({ message: "Education deleted" });
  } catch (err) {
    next(err);
  }
};
