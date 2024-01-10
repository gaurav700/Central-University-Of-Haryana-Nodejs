const mongoose = require('mongoose');
const { Schema } = mongoose;

const webinarSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    organiser: {
        type: String,
    },
    date: {
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
    registrations : [{
        type : Schema.Types.ObjectId,
        ref : "WebinarRegister"
    }]
});

module.exports = mongoose.model('Webinar', webinarSchema);





