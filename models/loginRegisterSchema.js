const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const registerSchema = new Schema({
    email :{
        type : String,
        required : true
    },

});
registerSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model("loginRegisterSchema", registerSchema);
