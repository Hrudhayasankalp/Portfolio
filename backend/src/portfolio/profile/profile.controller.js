const Profile = require("./profile.model");

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.createProfile = async (req, res, next) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true });
    res.json(profile);
  } catch (err) {
    err.statusCode = 400;
    next(err);
  }
};
