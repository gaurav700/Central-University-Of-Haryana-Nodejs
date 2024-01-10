if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const Confer = require("../models/index/conferSchema.js")
const Event = require("../models/index/eventSchema.js")
const Workshop = require("../models/index/workshopSchema.js")
const Webinar = require("../models/index/webinarSchema.js")
const Contact = require("../models/contactSchema.js")
const Speaker = require("../models/speakerSchema.js")
const nodemailer = require('nodemailer');


module.exports.dashboard = async(req, res) => {
    const resultEvent = await Event.find({});
    const resultConfer = await Confer.find({});
    const resultWorkshop = await Workshop.find({});
    const resultWebinar = await Webinar.find({});
    const totalEvent = resultEvent.length;
    const totalConfer = resultConfer.length;
    const totalWorkshop = resultWorkshop.length;
    const totalWebinar = resultWebinar.length;
    res.render("dashboard.ejs" ,{totalEvent,totalConfer,totalWorkshop,totalWebinar});
};

module.exports.contactUs = async(req,res)=>{
    const contactList = await Contact.find({});
    res.render("contactadmin.ejs",{contactList});
};

module.exports.showContact = async(req,res)=>{
    const { id } = req.params;
    const showContact = await Contact.findById(id);
    console.log(showContact);
    res.render("contactView.ejs", {showContact});
};

module.exports.deleteContact = async(req,res)=>{
    const { id } = req.params;
    const showContact = await Contact.findByIdAndDelete(id);
    req.flash("success", "Inquery Deleted successfully");
    res.redirect("/contactadmin");
}

module.exports.replyContact =  async(req,res)=>{
    const { id } = req.params;
    const result = await Contact.findById(id);
    let transporter = nodemailer.createTransport({
        service: 'gmail', // replace with your email provider
        auth: {
            user: 'jangidg0786@gmail.com', // replace with your email
            pass: process.env.passwordEmail // replace with your password
        }
    });

    let mailOptions = {
        from: 'jangidg0786@gmail.com', // sender address
        to: result.email, // list of receivers from the request query
        subject: `Re: ${result.fname} ${result.lname}`, // Subject line
        text: 'This is a reply to your contact inquiry' // plain text body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        req.flash("success", "Conference detail Added successfully");
        redirect("/contactAdmin")
    } catch (error) {
        console.error('Failed to send email', error);
        res.status(500).send('Failed to send email');
    }
}


module.exports.speakerIndex  = async(req,res)=>{
    const speakerList = await Speaker.find({});
    res.render("speaker.ejs" , {speakerList});
}
module.exports.speakerAddGet  = (req,res )=>{
    res.render("addSpeaker.ejs");
};
module.exports.speakerAddPost  = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let speakerList = await new Speaker(req.body.speaker);
    speakerList.photo = {url, filename};
    speakerList.save();
    req.flash("success", "Event detail Added successfully");
    res.redirect("/speakers");
}
module.exports.speakerDelete =  async(req,res)=>{
    let { id } = req.params;
    await Speaker.findByIdAndDelete(id);
    res.redirect("/speakers");
}
