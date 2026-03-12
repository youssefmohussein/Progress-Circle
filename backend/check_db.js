const mongoose = require('mongoose');

async function check() {
  try {
    const mongoUri = 'mongodb+srv://youssef2303820_db_user:gOS0yXs89x6MgjBN@cluster0.u9gfgzs.mongodb.net/progress-circle?appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const uSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', uSchema);
    const users = await User.find({ points: { $gt: 0 } }).limit(20).select('name points themePreferences avatarConfig');
    
    console.log('Found users:', users.length);
    users.forEach(u => {
      console.log(`- Name: ${u.name} (${u.points} pts)`);
      console.log(`  Theme: ${JSON.stringify(u.themePreferences || 'MISSING')}`);
      console.log(`  Avatar: ${JSON.stringify(u.avatarConfig || 'MISSING')}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error details:', err);
    process.exit(1);
  }
}

check();
