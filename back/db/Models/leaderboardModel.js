const mongoose = require('mongoose');

const leadboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    victory: {
        type: Number,
        required: true
    },
    loose: {
        type: Number,
        required: true
    },
});

const leaderboard = mongoose.model('Leaderboard', leadboardSchema);
module.exports = {leaderboard};