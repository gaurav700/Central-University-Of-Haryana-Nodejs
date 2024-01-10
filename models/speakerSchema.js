const mongoose = require('mongoose');
const { Schema } = mongoose;

const speakerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    founder: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    instagram: {
        type: String,
    },
    facebook: {
        type: String,
    },
    twitter: {
        type: String,
    },
    photo: {
        url: String,
        filename :String
    },
});

module.exports = mongoose.model('Speaker', speakerSchema);






