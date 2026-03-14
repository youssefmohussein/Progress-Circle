const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Session = require('../models/Session');
const Nutrition = require('../models/Nutrition');
const Battle = require('../models/Battle');
const Transaction = require('../models/Transaction');
const BodyMetric = require('../models/BodyMetric');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// Helper to draw a rounded rectangle with a gradient-like fill (solid for simplicity in PDFkit)
const drawCard = (doc, x, y, width, height, radius, color) => {
    doc.roundedRect(x, y, width, height, radius)
       .fill(color);
};

// @desc    Export user data to a high-fidelity professional PDF report
// @route   GET /api/export/pdf
// @access  Private (Premium Only)
exports.exportPDF = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = req.user;

        // Fetch user data - Ensuring we use Decrypted fields via hooks
        const tasks = await Task.find({ userId }).sort('-createdAt');
        const habits = await Habit.find({ userId }).sort('-streak');
        const sessions = await Session.find({ userId }).sort('-createdAt');
        const nutritionLogs = await Nutrition.find({ userId }).sort('-date').limit(7);
        const battles = await Battle.find({ 'participants.user': userId }).sort('-createdAt').limit(5);
        const transactions = await Transaction.find({ user: userId }).sort('-date').limit(10);
        const metrics = await BodyMetric.find({ user: userId }).sort('-date').limit(3);

        // Statistics calculation
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const syncPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const focusMinutes = sessions.filter(s => s.type === 'focus').reduce((acc, s) => acc + (s.duration || 0), 0);
        const topHabit = habits.length > 0 ? habits[0] : null;

        const doc = new PDFDocument({ 
            margin: 0, // Manual margins for full design control
            size: 'A4',
            bufferPages: true 
        });

        let filename = `Neural_Archive_${user.name.replace(/\s+/g, '_')}.pdf`;
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        // --- THEME PALETTE ---
        const DARK_BG = '#0b0d12';
        const PRIMARY = '#6366f1';
        const SECONDARY = '#8b5cf6';
        const TEXT_BRIGHT = '#ffffff';
        const TEXT_DIM = '#94a3b8';
        const BORDER = '#1e293b';
        const SUCCESS = '#10b981';

        // --- PAGE 1: COVER PAGE ---
        doc.rect(0, 0, 612, 792).fill(DARK_BG);
        
        // Background decorative patterns
        doc.fillColor(PRIMARY).opacity(0.1);
        doc.path('M 0 0 L 612 200 L 612 0 Z').fill();
        doc.path('M 0 792 L 612 592 L 612 792 Z').fill();
        doc.opacity(1);

        doc.fillColor(PRIMARY).fontSize(40).font('Helvetica-Bold').text('PROGRESS', 0, 300, { align: 'center', characterSpacing: 5 });
        doc.fillColor(TEXT_BRIGHT).fontSize(40).font('Helvetica-Bold').text('CIRCLE', { align: 'center', characterSpacing: 5 });
        
        doc.moveDown(1);
        doc.rect(250, doc.y, 112, 2).fill(SECONDARY);
        doc.moveDown(2);

        doc.fillColor(TEXT_DIM).fontSize(12).font('Helvetica').text('NEURAL PERFORMANCE ARCHIVE', { align: 'center', characterSpacing: 2 });
        doc.moveDown(0.5);
        doc.fillColor(TEXT_BRIGHT).fontSize(14).text(`PREPARED FOR: ${user.name.toUpperCase()}`, { align: 'center' });
        
        doc.fontSize(10).fillColor(TEXT_DIM).text(`SYNC DATE: ${new Date().toLocaleDateString()}`, 0, 700, { align: 'center' });

        // --- PAGE 2: EXECUTIVE DASHBOARD ---
        doc.addPage();
        doc.rect(0, 0, 612, 792).fill(DARK_BG);

        // Header
        doc.fillColor(PRIMARY).fontSize(18).font('Helvetica-Bold').text('EXECUTIVE OVERVIEW', 50, 50);
        doc.rect(50, 75, 512, 1).fill(BORDER);

        // Stats Box Section
        const statsY = 100;
        
        // Sync Rate Card
        drawCard(doc, 50, statsY, 160, 100, 15, '#151824');
        doc.fillColor(PRIMARY).fontSize(28).font('Helvetica-Bold').text(`${syncPercentage}%`, 70, statsY + 30);
        doc.fillColor(TEXT_DIM).fontSize(9).font('Helvetica').text('NEURAL SYNC RATE', 70, statsY + 65);

        // Focus Card
        drawCard(doc, 226, statsY, 160, 100, 15, '#151824');
        doc.fillColor(SECONDARY).fontSize(28).font('Helvetica-Bold').text(`${focusMinutes}`, 246, statsY + 30);
        doc.fillColor(TEXT_DIM).fontSize(9).font('Helvetica').text('TOTAL FOCUS MINS', 246, statsY + 65);

        // Streak Card
        drawCard(doc, 402, statsY, 160, 100, 15, '#151824');
        doc.fillColor(SUCCESS).fontSize(28).font('Helvetica-Bold').text(`${topHabit ? topHabit.streak : 0}`, 422, statsY + 30);
        doc.fillColor(TEXT_DIM).fontSize(9).font('Helvetica').text('MAX STREAK LENGTH', 422, statsY + 65);

        // Habit Progress Visualization
        doc.moveDown(10);
        doc.fillColor(PRIMARY).fontSize(14).font('Helvetica-Bold').text('CONSISTENCY LOOPS (HABITS)');
        doc.moveDown(1);

        if (habits.length > 0) {
            habits.slice(0, 5).forEach(h => {
                const habitY = doc.y;
                doc.fillColor(TEXT_BRIGHT).fontSize(11).font('Helvetica-Bold').text(h.name, 50);
                doc.fillColor(TEXT_DIM).fontSize(8).font('Helvetica').text(`${h.streak} DAY STREAK`, 50, habitY + 15);
                
                // Draw Streak Bar
                const maxBarWidth = 300;
                const barWidth = Math.min((h.streak / 30) * maxBarWidth, maxBarWidth);
                doc.rect(260, habitY + 5, maxBarWidth, 10).fill('#1e293b');
                doc.rect(260, habitY + 5, Math.max(barWidth, 5), 10).fill(SECONDARY);
                doc.moveDown(2);
            });
        } else {
            doc.fillColor(TEXT_DIM).fontSize(10).font('Helvetica-Oblique').text('No habit synchronization data available.', 50);
        }

        // --- PAGE 3: DETAILED NODE LOGS ---
        doc.addPage();
        doc.rect(0, 0, 612, 792).fill(DARK_BG);
        doc.fillColor(PRIMARY).fontSize(18).font('Helvetica-Bold').text('NEURAL NODE LOGS (TASKS)', 50, 50);
        doc.rect(50, 75, 512, 1).fill(BORDER);

        // Table Header
        const tableY = 100;
        doc.fillColor(TEXT_DIM).fontSize(9).font('Helvetica-Bold');
        doc.text('ID', 50, tableY);
        doc.text('OBJECTIVE', 100, tableY);
        doc.text('STATUS', 400, tableY);
        doc.text('PRIORITY', 480, tableY);
        doc.moveDown(1.5);
        doc.rect(50, tableY + 15, 512, 1).fill(BORDER);

        tasks.slice(0, 20).forEach((t, i) => {
            if (doc.y > 700) {
                doc.addPage();
                doc.rect(0, 0, 612, 792).fill(DARK_BG);
                doc.y = 50;
            }
            const currentY = doc.y;
            
            // Alternating row background
            if (i % 2 === 0) {
                doc.fillColor('#151824').rect(50, currentY - 5, 512, 25).fill();
            }

            doc.fillColor(TEXT_DIM).fontSize(8).font('Helvetica').text(`${i + 1}`, 50, currentY);
            doc.fillColor(TEXT_BRIGHT).fontSize(10).font('Helvetica-Bold').text(t.title || 'NULL_NODE', 100, currentY, { width: 280, lineBreak: false });
            
            const isComp = t.status === 'completed';
            doc.fillColor(isComp ? SUCCESS : '#f59e0b').fontSize(8).font('Helvetica-Bold').text(isComp ? 'DONE' : 'ACTIVE', 400, currentY);
            doc.fillColor(TEXT_DIM).fontSize(8).font('Helvetica').text((t.priority || 'MED').toUpperCase(), 480, currentY);
            
            doc.moveDown(1.5);
        });

        // --- PAGE 4: BIOLOGICAL FUEL & COLLABORATION ---
        doc.addPage();
        doc.rect(0, 0, 612, 792).fill(DARK_BG);
        
        // Nutrition Section
        doc.fillColor(PRIMARY).fontSize(16).font('Helvetica-Bold').text('BIOLOGICAL FUEL ANALYSIS', 50, 50);
        doc.rect(50, 75, 512, 1).fill(BORDER);
        
        let nutY = 100;
        if (nutritionLogs.length > 0) {
            nutritionLogs.forEach((log, i) => {
                const dayTotals = log.meals.reduce((acc, m) => ({
                    cals: acc.cals + m.calories,
                    prot: acc.prot + m.protein
                }), { cals: 0, prot: 0 });

                drawCard(doc, 50, nutY, 512, 40, 10, '#151824');
                doc.fillColor(TEXT_BRIGHT).fontSize(9).font('Helvetica-Bold').text(log.date, 70, nutY + 15);
                doc.fillColor(TEXT_DIM).fontSize(8).text(`${dayTotals.cals} KCAL // ${dayTotals.prot}g PROT // ${log.waterIntake}ml HYDRATION`, 180, nutY + 15);
                nutY += 50;
            });
        } else {
            doc.fillColor(TEXT_DIM).fontSize(10).font('Helvetica-Oblique').text('No biometry logs detected for this cycle.', 50, 100);
            nutY = 130;
        }

        // Synergy Section
        doc.moveDown(2);
        doc.fillColor(SECONDARY).fontSize(16).font('Helvetica-Bold').text('COLLABORATIVE RESONANCE', 50, nutY + 20);
        doc.rect(50, nutY + 45, 512, 1).fill(BORDER);
        
        let synY = nutY + 65;
        drawCard(doc, 50, synY, 160, 60, 12, '#151824');
        doc.fillColor(SECONDARY).fontSize(18).text(`${user.socialStats?.synergyPoints || 0}`, 70, synY + 15);
        doc.fillColor(TEXT_DIM).fontSize(8).text('SYNERGY POINTS', 70, synY + 40);

        drawCard(doc, 226, synY, 160, 60, 12, '#151824');
        doc.fillColor(TEXT_BRIGHT).fontSize(18).text(`${user.socialStats?.battlesWon || 0}`, 246, synY + 15);
        doc.fillColor(TEXT_DIM).fontSize(8).text('ARENA VICTORIES', 246, synY + 40);

        drawCard(doc, 402, synY, 160, 60, 12, '#151824');
        doc.fillColor(TEXT_BRIGHT).fontSize(18).text(`${user.socialStats?.orbsSent || 0}`, 422, synY + 15);
        doc.fillColor(TEXT_DIM).fontSize(8).text('ORBS DISPATCHED', 422, synY + 40);

        // --- PAGE 5: FINANCIAL INTELLIGENCE ---
        doc.addPage();
        doc.rect(0, 0, 612, 792).fill(DARK_BG);
        doc.fillColor(SUCCESS).fontSize(18).font('Helvetica-Bold').text('FINANCIAL INTELLIGENCE', 50, 50);
        doc.rect(50, 75, 512, 1).fill(BORDER);

        const finY = 100;
        drawCard(doc, 50, finY, 250, 80, 15, '#151824');
        doc.fillColor(TEXT_DIM).fontSize(8).text('CASH BALANCE', 70, finY + 20);
        doc.fillColor(TEXT_BRIGHT).fontSize(20).text(`$${user.cashBalance?.toLocaleString() || 0}`, 70, finY + 40);

        drawCard(doc, 312, finY, 250, 80, 15, '#151824');
        doc.fillColor(TEXT_DIM).fontSize(8).text('CREDIT BALANCE', 332, finY + 20);
        doc.fillColor(TEXT_BRIGHT).fontSize(20).text(`$${user.creditBalance?.toLocaleString() || 0}`, 332, finY + 40);

        doc.moveDown(6);
        doc.fillColor(TEXT_DIM).fontSize(10).font('Helvetica-Bold').text('RECENT TRANSACTIONS (NEURAL LEDGER)', 50);
        doc.moveDown(1);

        transactions.forEach((tx, i) => {
            const currentTxY = doc.y;
            doc.fillColor(BORDER).rect(50, currentTxY - 5, 512, 25).fill();
            doc.fillColor(TEXT_BRIGHT).fontSize(9).text(tx.category || 'General', 60, currentTxY);
            doc.fillColor(tx.type === 'income' ? SUCCESS : '#f87171').fontSize(9).text(`${tx.type === 'income' ? '+' : '-'}$${tx.amount}`, 480, currentTxY, { align: 'right', width: 70 });
            doc.moveDown(1.5);
        });

        // --- PAGE 6: PHYSICAL WELLNESS METRICS ---
        doc.addPage();
        doc.rect(0, 0, 612, 792).fill(DARK_BG);
        doc.fillColor(PRIMARY).fontSize(18).font('Helvetica-Bold').text('PHYSICAL WELLNESS METRICS', 50, 50);
        doc.rect(50, 75, 512, 1).fill(BORDER);

        if (metrics.length > 0) {
            let metY = 100;
            metrics.forEach((m, i) => {
                drawCard(doc, 50, metY, 512, 120, 15, '#151824');
                doc.fillColor(TEXT_BRIGHT).fontSize(10).font('Helvetica-Bold').text(`SYNC DATE: ${m.date.toLocaleDateString()}`, 70, metY + 15);
                
                // Grid of metrics
                doc.fillColor(TEXT_DIM).fontSize(8).font('Helvetica');
                doc.text('WEIGHT', 70, metY + 45);
                doc.fillColor(TEXT_BRIGHT).fontSize(12).text(`${m.weight || '--'} kg`, 70, metY + 60);

                doc.fillColor(TEXT_DIM).text('BODY FAT', 170, metY + 45);
                doc.fillColor(TEXT_BRIGHT).text(`${m.bodyFat || '--'}%`, 170, metY + 60);

                doc.fillColor(TEXT_DIM).text('MUSCLE MASS', 270, metY + 45);
                doc.fillColor(TEXT_BRIGHT).text(`${m.muscleMass || '--'}%`, 270, metY + 60);

                doc.fillColor(TEXT_DIM).text('BMR', 370, metY + 45);
                doc.fillColor(TEXT_BRIGHT).text(`${m.bmr || '--'} kcal`, 370, metY + 60);

                doc.fontSize(7).fillColor(TEXT_DIM).text(`STATURE LOG: S:${m.stomach || '--'}cm // A:${m.arm || '--'}cm // L:${m.leg || '--'}cm`, 70, metY + 95);

                metY += 140;
            });
        } else {
            doc.fillColor(TEXT_DIM).fontSize(10).font('Helvetica-Oblique').text('No physical body metrics synced in the current epoch.', 50, 100);
        }

        // --- GLOBAL FOOTER ---
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            
            // Branding Watermark
            if (i > 0) {
                doc.fontSize(80).font('Helvetica-Bold').fillColor(PRIMARY).opacity(0.02).text('CIRCLE', 50, 300, { align: 'center' });
                doc.opacity(1);
            }

            // Footer Text
            doc.rect(50, 750, 512, 1).fill(BORDER);
            doc.fontSize(8).fillColor(TEXT_DIM).font('Helvetica').text(
                `PROGRESS CIRCLE // NEURAL DATA ARCHIVE // PAGE ${i + 1} OF ${range.count}`,
                50,
                765,
                { align: 'center', characterSpacing: 1 }
            );
        }

        doc.end();

    } catch (error) {
        console.error('PDF Generation Error:', error);
        next(error);
    }
};

// @desc    Export user data to CSV for Data Science
// @route   GET /api/export/csv
// @access  Private (Premium Only)
exports.exportCSV = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ userId }).lean();
        const habits = await Habit.find({ userId }).lean();
        const sessions = await Session.find({ userId }).lean();

        // Combine data for a comprehensive science export
        const combinedData = [
            ...tasks.map(t => ({ dataType: 'TASK', ...t })),
            ...habits.map(h => ({ dataType: 'HABIT', ...h })),
            ...sessions.map(s => ({ dataType: 'SESSION', ...s }))
        ];

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(combinedData);

        res.attachment(`Neural_Science_${req.user.name.replace(/\s+/g, '_')}.csv`);
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};

// @desc    Export user data to JSON
// @route   GET /api/export/json
// @access  Private (Premium Only)
exports.exportJSON = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ userId });
        const habits = await Habit.find({ userId });
        const sessions = await Session.find({ userId });

        const data = {
            user: { id: req.user.id, name: req.user.name, plan: req.user.plan },
            timestamp: new Date().toISOString(),
            dataset: {
                tasks,
                habits,
                sessions
            }
        };

        res.attachment(`Neural_Dataset_${req.user.name.replace(/\s+/g, '_')}.json`);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
