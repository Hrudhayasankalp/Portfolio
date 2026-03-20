const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

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
    
    await mongoose.disconnect();
  } catch (err) {
    console.error("ERROR checking DB:", err);
    process.exit(1);
  }
}

checkDB();
