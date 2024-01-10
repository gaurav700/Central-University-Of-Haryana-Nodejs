const Confer = require("../models/index/conferSchema.js")
const ConferRegister = require("../models/register/conferRegisterSchema.js");
// fucntion to pass
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}



module.exports.index = async(req, res) => {
    const result = await Confer.find({});
    res.render("confer.ejs" ,{ result, formatDate });
};



module.exports.editGet = async(req, res) => {
    const { id } = req.params;
    const showConfer = await Confer.findById(id);
    res.render("edit_confer.ejs", {showConfer});
};
module.exports.editPost = async(req,res)=>{
    const { id } = req.params;
    let updateConfer = await Confer.findByIdAndUpdate(id,{...req.body.confer});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updateConfer.photo = {url,filename};
        await updateConfer.save();
    }
    req.flash("success", "Conference detail updated successfully");
    res.redirect("/conferAdmin");
};


module.exports.addGet = (req, res) => {
    res.render("add_confer.ejs");
};
module.exports.addPost = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let conferList = await new Confer(req.body.confer);
    conferList.photo = {url, filename};
    conferList.save();
    req.flash("success", "Conference detail Added successfully");
    res.redirect("/conferAdmin");
};


module.exports.view = async(req, res) => {
    const { id } = req.params;
    const showConfer = await Confer.findById(id);
    res.render("show_confer.ejs", {showConfer,formatDate});
};



module.exports.destroyConfer = async(req, res) => {
    const { id } = req.params;
    const confer = await Confer.findById(id).populate('registrations');
    for (const registration of confer.registrations) {
        await ConferRegister.findByIdAndDelete(registration._id);
    }
    await Confer.findByIdAndDelete(id)
    req.flash("success", "Conference detail deleted successfully");
    res.redirect("/conferAdmin");
}

module.exports.registrationConfer = async(req,res)=>{
    let { id } = req.params;
    const result = await Confer.findById(id).populate("registrations");
    res.render("conferregistrationList.ejs",{ result });
};