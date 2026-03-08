const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // Find a user who is NOT "youssef" (the current user)
    const otherUser = await User.findOne({ email: { $ne: 'youssefpls9@gmail.com' } });

    if (otherUser) {
        console.log(`Found user: ${otherUser.email}. Updating avatar...`);
        otherUser.avatarConfig = {
            hair: 5, // Mohawk
            shirt: 4, // Gym Outfit
            pants: 1, // Shorts
            shoes: 2, // Boots
            eyes: 2, // Cool
            eyeColor: 2, // Blue
            accessory: 1, // Glasses
            bg: 3 // Galaxy
        };
        await otherUser.save();
        console.log('Avatar updated successfully!');
    } else {
        console.log('No other users found.');
    }
    process.exit(0);
}).catch(console.error);
