require('dotenv').config();
const { getAstraAnalysis } = require('./controllers/aiController');
const mongoose = require('mongoose');

async function test() {
    try {
        console.log("Testing Astra Analysis Logic...");
        
        // Mock Request and Response
        const req = {
            user: {
                _id: new mongoose.Types.ObjectId(),
                points: 450,
                plan: 'premium'
            }
        };
        
        const res = {
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.data = data;
                return this;
            }
        };

        const next = (err) => {
            console.error("Next called with error:", err);
        };

        // Note: This test will fail if it tries to hit a real DB without connection.
        // But we want to see if the logic handles '0 tasks' correctly if the DB returns empty.
        
        // For a real integration test, we'd need to connect to DB.
        const mongoUri = 'mongodb+srv://youssef2303820_db_user:gOS0yXs89x6MgjBN@cluster0.u9gfgzs.mongodb.net/progress-circle?appName=Cluster0';
        await mongoose.connect(mongoUri);
        
        console.log("DB Connected. Fetching real analysis for a test user...");
        
        // Find a real user to test with
        const User = require('./models/User');
        const realUser = await User.findOne({ points: { $gt: 0 } });
        
        if (realUser) {
            req.user = realUser;
            await getAstraAnalysis(req, res, next);
            console.log("Analysis Result:", JSON.stringify(res.data, null, 2));
        } else {
            console.log("No real users found to test with.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

test();
