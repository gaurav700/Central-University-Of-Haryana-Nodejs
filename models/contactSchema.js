const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    message: {
        type: String,
    }
});

module.exports = mongoose.model('Contact', contactSchema);






