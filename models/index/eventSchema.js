const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new mongoose.Schema({
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
        ref : "EventRegister"
    }]
});

module.exports = mongoose.model('Event', eventSchema);






