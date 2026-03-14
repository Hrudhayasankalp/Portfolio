const Profile = require("./profile.model");

async function getProfile() {
  return await Profile.findOne(); // single profile for portfolio
}

async function upsertProfile(data) {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create(data);
  } else {
    Object.assign(profile, data);
    await profile.save();
  }
  return profile;
}

module.exports = {
  getProfile,
  upsertProfile,
};
