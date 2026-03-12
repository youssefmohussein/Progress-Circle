require('dotenv').config();
const { getAstraAnalysis } = require('./controllers/aiController');
const Task = require('./models/Task');
const Habit = require('./models/Habit');
const Session = require('./models/Session');

async function testV2() {
    console.log("--- Astra V2 Logic: Pattern Recognition Test ---");

    // Mock data: 30 days of history
    const mockTasks = [
        { title: 'Finish Dissertation', status: 'pending', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), category: 'Academic' },
        { title: 'Buy Milk', status: 'completed', createdAt: new Date() },
    ];
    
    // 3 major focus sessions at 8 PM (20:00)
    const mockSessions = [
        { startTime: new Date('2026-03-01T20:00:00'), duration: 60, type: 'focus' },
        { startTime: new Date('2026-03-02T20:00:00'), duration: 60, type: 'focus' },
        { startTime: new Date('2026-03-03T20:00:00'), duration: 120, type: 'focus' },
        { startTime: new Date('2026-03-04T08:00:00'), duration: 30, type: 'focus' },
    ];

    const mockHabits = [
        { name: 'Deep Work', streak: 12 }
    ];

    // Mock Mongoose Find
    Task.find = async () => mockTasks;
    Habit.find = async () => mockHabits;
    Session.find = async () => mockSessions;

    const req = {
        user: { _id: 'mock_id', name: 'Joey', points: 950, plan: 'premium' }
    };

    const res = {
        status: function(c) { this.code = c; return this; },
        json: function(d) { 
            console.log("\n[Astra V2 Output]");
            console.log("Analytic Log:", d.data.log);
            console.log("\n[Stats]");
            console.log("- Peak Hour Identified:", d.data.stats.peakHour);
            console.log("- Bottleneck Sector:", d.data.stats.bottleneck);
            console.log("\n[Recommendation]");
            console.log("- Recommendation:", d.data.recommendation);
            
            // Validate Peak Hour (Should be 8 PM)
            if (d.data.stats.peakHour === '8 PM') {
                console.log("\n✅ Peak Hour correctly identified as 8 PM.");
            } else {
                console.log("\n❌ Peak Hour logic failure. Expected 8 PM, got:", d.data.stats.peakHour);
            }

            // Validate Bottleneck ( Dissertation is 10 days old)
            if (d.data.stats.bottleneck === 'Academic' && d.data.log.includes('10 days')) {
                console.log("✅ Bottleneck logic correctly identified Dissertation.");
            }

            return this;
        }
    };

    try {
        await getAstraAnalysis(req, res, () => {});
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testV2();
