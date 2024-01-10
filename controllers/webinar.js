const Webinar = require("../models/index/webinarSchema.js")
const WebinarRegister = require("../models/register/webinarRegisterSchema.js");
// fucntion to pass
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

module.exports.index = async(req, res) => {
    const result = await Webinar.find({});
    res.render("webinar.ejs" ,{ result, formatDate });
};

module.exports.editGet = async(req, res) => {
    const { id } = req.params;
    const showWebinar = await Webinar.findById(id);
    res.render("edit_webinar.ejs", {showWebinar});
};
module.exports.editPost = async(req,res)=>{
    const { id } = req.params;
    let updateWebinar = await Webinar.findByIdAndUpdate(id,{...req.body.webinar});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updateWebinar.photo = {url,filename};
        await updateWebinar.save();
    }
    req.flash("success", "Webinar detail updated successfully");
    res.redirect("/webinarAdmin");
};

module.exports.addGet = (req, res) => {
    res.render("add_webinar.ejs");
};
module.exports.addPost = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let webinarList = await new Webinar(req.body.webinar);
    webinarList.photo = {url, filename};
    webinarList.save();
    req.flash("success", "Webinar detail added successfully");
    res.redirect("/webinarAdmin");
};

module.exports.view = async(req, res) => {
    const { id } = req.params;
    const showWebinar = await Webinar.findById(id);
    res.render("show_webinar.ejs", {showWebinar,formatDate});
};

module.exports.destroyWebinar = async(req, res) => {
    const { id } = req.params;
    const webinar = await Webinar.findById(id).populate('registrations');
    for (const registration of webinar.registrations) {
        await WebinarRegister.findByIdAndDelete(registration._id);
    }
    await Webinar.findByIdAndDelete(id)
    req.flash("success", "Webinar detail deleted successfully");
    res.redirect("/webinarAdmin");
};

module.exports.registrationWebinar = async(req,res)=>{
    let { id } = req.params;
    const result = await Webinar.findById(id).populate("registrations");
    res.render("webinarregistrationList.ejs",{ result });
};