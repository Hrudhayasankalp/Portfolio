const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://234g1a0558_db_user:Psankalp%401605@portfolio.flhhbeu.mongodb.net/?appName=portfolio";

const ProfileSchema = new mongoose.Schema({
  name: String,
  role: String,
  bio: String
});
const Profile = mongoose.model('Profile', ProfileSchema);

async function checkDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    
    const profile = await Profile.findOne();
    if (profile) {
      console.log("DATA_FOUND: Profile exists in DB:", JSON.stringify(profile));
    } else {
      console.log("DATA_NOT_FOUND: No profile found in DB.");
    }
    
    const SkillSchema = new mongoose.Schema({ name: String });
    const Skill = mongoose.model('Skill', SkillSchema);
    const skills = await Skill.find();
    console.log("SKILLS_COUNT:", skills.length);

    await mongoose.disconnect();
  } catch (err) {
    console.error("ERROR checking DB:", err);
    process.exit(1);
  }
}

checkDB();
