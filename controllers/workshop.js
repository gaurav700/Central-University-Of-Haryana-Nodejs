const Workshop = require("../models/index/workshopSchema.js")
const WorkshopRegister = require("../models/register/workshopRegisterSchema.js")
// fucntion to pass
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

module.exports.index = async(req, res) => {
    const result = await Workshop.find({});
    res.render("workshop.ejs" ,{ result, formatDate });
};

module.exports.editGet = async(req, res) => {
    const { id } = req.params;
    const showWorkshop = await Workshop.findById(id);
    res.render("edit_workshop.ejs", {showWorkshop});
};
module.exports.editPost = async(req,res)=>{
    const { id } = req.params;
    let updateWorkshop = await Workshop.findByIdAndUpdate(id,{...req.body.workshop});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updateWorkshop.photo = {url,filename};
        await updateWorkshop.save();
    }
    req.flash("success", "Workshop detail updated successfully");
    res.redirect("/workshopAdmin");
};

module.exports.addGet = (req, res) => {
    res.render("add_workshop.ejs");
};
module.exports.addPost = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let workshopList = await new Workshop(req.body.workshop);
    workshopList.photo = {url, filename};
    workshopList.save();
    req.flash("success", "Workshop detail added successfully");
    res.redirect("/workshopAdmin");
};

module.exports.view = async(req, res) => {
    const { id } = req.params;
    const showWorkshop = await Workshop.findById(id);
    res.render("show_workshop.ejs", {showWorkshop,formatDate});
};

module.exports.destroyWorkshop = async(req, res) => {
    const { id } = req.params;
    const workshop = await Workshop.findById(id).populate('registrations');
    for (const registration of workshop.registrations) {
        await WorkshopRegister.findByIdAndDelete(registration._id);
    }
    await Workshop.findByIdAndDelete(id)
    req.flash("success", "Workshop detail deleted successfully");
    res.redirect("/workshopAdmin");
};

module.exports.registrationWorkshop = async(req,res)=>{
    let { id } = req.params;
    const result = await Workshop.findById(id).populate("registrations");
    res.render("workshopregistrationList.ejs",{ result });
};