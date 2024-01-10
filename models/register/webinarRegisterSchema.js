const mongoose = require('mongoose');
const { Schema } = mongoose;

const webinarRegisterSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    college: {
        type: String,
    },
    add1: {
        type: String,
    },
    add2: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
});

module.exports = mongoose.model('WebinarRegister', webinarRegisterSchema);
