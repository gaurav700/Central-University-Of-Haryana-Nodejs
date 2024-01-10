const Event = require("../models/index/eventSchema.js")
const EventRegister = require("../models/register/eventRegisterSchema.js");

// fucntion to pass
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

module.exports.index = async(req, res) => {
    const result = await Event.find({});
    res.render("events.ejs" ,{ result, formatDate });
};


module.exports.editGet = async(req, res) => {
    const { id } = req.params;
    const showEvent = await Event.findById(id);
    res.render("edit_events.ejs", {showEvent});
};
module.exports.editPost = async(req,res)=>{
    const { id } = req.params;
    let updateEvent = await Event.findByIdAndUpdate(id,{...req.body.event});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updateEvent.photo = {url,filename};
        await updateEvent.save();
    }
    req.flash("success", "Event detail Updated successfully");
    res.redirect("/eventAdmin");
};

module.exports.addGet = (req, res) => {
    res.render("add_events.ejs");
};
module.exports.addPost = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let eventList = await new Event(req.body.event);
    eventList.photo = {url, filename};
    eventList.save();
    req.flash("success", "Event detail Added successfully");
    res.redirect("/eventAdmin");
};

module.exports.view = async(req, res) => {
    const { id } = req.params;
    const showEvent = await Event.findById(id);
    res.render("show_events.ejs", {showEvent,formatDate});
};

module.exports.destroyEvent = async(req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id).populate('registrations');
    for (const registration of event.registrations) {
        await EventRegister.findByIdAndDelete(registration._id);
    }
    await Event.findByIdAndDelete(id)
    req.flash("success", "Event detail deleted successfully");
    res.redirect("/eventAdmin");
};

module.exports.registrationEvent = async(req,res)=>{
    let { id } = req.params;
    const result = await Event.findById(id).populate("registrations");
    res.render("eventregistrationList.ejs",{ result });
};