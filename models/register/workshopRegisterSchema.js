const mongoose = require('mongoose');
const { Schema } = mongoose;

const workshopRegisterSchema = new mongoose.Schema({
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
    fees: {
        url: String,
        filename: String,
    },
});

module.exports = mongoose.model('WorkshopRegister', workshopRegisterSchema);
