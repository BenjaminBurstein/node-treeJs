const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    house : {
        type: String,
        required: true
    },
    apiId : {
        type: Number,
        required: true
    }
});
const User = mongoose.model('User', userSchema);
module.exports = {User};