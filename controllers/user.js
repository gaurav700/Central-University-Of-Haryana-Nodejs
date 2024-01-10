const Confer = require("../models/index/conferSchema.js")
const Event = require("../models/index/eventSchema.js")
const Workshop = require("../models/index/workshopSchema.js")
const Webinar = require("../models/index/webinarSchema.js")
const Contact = require("../models/contactSchema.js")
const Speaker = require("../models/speakerSchema.js")
const ConferRegister = require("../models/register/conferRegisterSchema.js")
const EventRegister = require("../models/register/eventRegisterSchema.js")
const WorkshopRegister = require("../models/register/workshopRegisterSchema.js")
const WebinarRegister = require("../models/register/webinarRegisterSchema.js")


function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

module.exports.index = async(req, res) => {
    const speakerList = await Speaker.find({});
    res.render("index.ejs", {speakerList});
};

module.exports.about =  (req, res) => {
    res.render("about.ejs");
};



module.exports.schedule = async(req, res) => {
    const resultEvent = await Event.find({});
    const resultConfer = await Confer.find({});
    const resultWorkshop = await Workshop.find({});
    const resultWebinar = await Webinar.find({});
    res.render("schedule.ejs" ,{resultEvent,resultConfer,resultWorkshop,resultWebinar,formatDate});
};




module.exports.contact = (req, res) => {
    res.render("contact.ejs");
};
module.exports.contactAdd = async(req,res)=>{
    let contactList = await new Contact(req.body.contact);
    contactList.save();
    req.flash("success", "Inquery sent successfully");
    res.redirect("/contact");
}


module.exports.eventRegistration = async(req, res) => {
    const { id } = req.params;
    const resultEvent = await Event.findById(id);
    res.render("eventRegistration.ejs", {resultEvent,formatDate});
};
module.exports.eventRegistrationAdd = async(req,res)=>{
    let { id } = req.params;
    let eventDetail =  await Event.findById(id);
    let url = req.file.path;
    let filename = req.file.filename;
    let eventList = await new EventRegister(req.body.event);
    eventList.fees = {url, filename};
    eventList.save();
    eventDetail.registrations.push(eventList);
    await eventDetail.save();
    req.flash("success", "Event Registration done successfully");
    res.redirect("/schedule");
};

module.exports.conferRegistration = async(req, res) => {
    const { id } = req.params;
    const resultConfer = await Confer.findById(id);
    res.render("conferRegistration.ejs", {resultConfer, formatDate});
};
module.exports.conferRegistrationAdd = async(req,res)=>{
    let { id } = req.params;
    let conferDetail =  await Confer.findById(id);
    let url = req.file.path;
    let filename = req.file.filename;
    let conferList = await new ConferRegister(req.body.confer);
    conferList.fees = {url, filename};
    conferList.save();
    conferDetail.registrations.push(conferList);
    await conferDetail.save();
    req.flash("success", "Conference Registration done successfully");
    res.redirect("/schedule");
};


module.exports.workshopRegistration = async(req, res) => {
    const { id } = req.params;
    const resultWorkshop = await Workshop.findById(id);
    res.render("workshopRegistration.ejs", {resultWorkshop, formatDate});
};
module.exports.workshopRegistrationAdd = async(req,res)=>{
    let { id } = req.params;
    let workshopDetail =  await Workshop.findById(id);
    let url = req.file.path;
    let filename = req.file.filename;
    let workshopList = await new WorkshopRegister(req.body.workshop);
    workshopList.fees = {url, filename};
    workshopList.save();
    workshopDetail.registrations.push(workshopList);
    await workshopDetail.save();
    req.flash("success", "Workshop Registration done successfully");
    res.redirect("/schedule");
};


module.exports.webinarRegistration = async(req, res) => {
    const { id } = req.params;
    const resultWebinar = await Webinar.findById(id);
    res.render("webinarRegistration.ejs", {resultWebinar, formatDate});
};
module.exports.webinarRegistrationAdd = async(req,res)=>{
    let { id } = req.params;
    let webinarDetail =  await Webinar.findById(id);
    let webinarList = await new WebinarRegister(req.body.webinar);
    webinarList.save();
    webinarDetail.registrations.push(webinarList);
    await webinarDetail.save();
    req.flash("success", "Webinar Registration done successfully");
    res.redirect("/schedule");
};
