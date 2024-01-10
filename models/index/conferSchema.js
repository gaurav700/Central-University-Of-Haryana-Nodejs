const mongoose = require('mongoose');
const { Schema } = mongoose;

const conferSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    organiser: {
        type: String,
    },
    from_date: {
        type: Date,
    },
    to_date: {
        type: Date,
    },
    time: {
        type: String,
    },
    venue: {
        type: String,
    },
    link: {
        type: String,
    },
    photo: {
        url: String,
        filename: String,
    },
    description: {
        type: String,
    },
    fees: {
        type: Number,
    },
    registrations : [{
        type : Schema.Types.ObjectId,
        ref : "ConferRegister"
    }]
});

module.exports = mongoose.model('Confer', conferSchema);






