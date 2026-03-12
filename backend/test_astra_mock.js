require('dotenv').config();
const { getAstraAnalysis } = require('./controllers/aiController');
const Task = require('./models/Task');
const Habit = require('./models/Habit');

async function testMock() {
    console.log("--- Astra Analysis Logic: Mock Unit Test ---");

    // Mock data
    const mockTasks = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'pending' },
    ];
    const mockHabits = [
        { name: 'Meditation', streak: 5 },
        { name: 'Reading', streak: 2 }
    ];

    // Mock Mongoose Find
    Task.find = async () => mockTasks;
    Habit.find = async () => mockHabits;

    const req = {
        user: { _id: 'mock_id', name: 'Joey', points: 800, plan: 'premium' }
    };

    const res = {
        status: function(c) { this.code = c; return this; },
        json: function(d) { 
            console.log("\n[SUCCESS] AI Log Generated:");
            console.log("Log Content:", d.data.log);
            console.log("\n[DEBUG] Stats Calculated:");
            console.log("- Completion Rate:", d.data.stats.completionRate + "%");
            console.log("- Active Habits:", d.data.stats.activeHabits);
            return this;
        }
    };

    try {
        await getAstraAnalysis(req, res, () => {});
        console.log("\n--- Test Passed ---");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testMock();
