const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    globalMultiplier: {
        type: Number,
        default: 1.0
    },
    broadcastMessage: {
        type: String,
        default: ''
    },
    lastBackup: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure only one settings document exists
globalSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
