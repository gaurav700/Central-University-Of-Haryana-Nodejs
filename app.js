if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
let port = 8080;
const path = require("path");
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const loginRegisterSchema = require("./models/loginRegisterSchema.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");

/* IMPORTS FOR IMAGE UPLAOD START */
const multer = require("multer");
const { storage, cloudinary } = require("./cloudConfig.js");
const upload = multer({ storage });
/* IMPORTS FOR IMAGE UPLAOD ENDS */

/* CONTROLLER IMPORT STARTS */
const eventController = require("./controllers/event.js");
const conferController = require("./controllers/confer.js");
const webinarController = require("./controllers/webinar.js");
const workshopController = require("./controllers/workshop.js");
const dashboardController = require("./controllers/dashboard.js");
const authController = require("./controllers/auth.js")
const userController = require("./controllers/user.js");
/* CONTROLLER IMPORT ENDS */

/* CONTROLLER IMPORT STARTS */
const AuthMiddle = require("./middlewares/middleware.js");
/* CONTROLLER IMPORT ENDS */

/* UTILS IMPORT STARTS */
const wrapAsync = require("./utils/wrapAsync.js");
const { wrap } = require("module");
const MongoStore = require("connect-mongo");
/* UTILS IMPORT ENDS */

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


/*  CONNECTION TO MONGODB START HERE */
const db_url = process.env.ATLASDB_URL;
main()
    .then(() => { 
        console.log("Connected to DB"); 
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(db_url);
};
/* CONNECTION TO MONGODB ENDS HERE */




/* SESSIONS OPTION FOR SESSIONS AND PASSPORT FOR LOGIN AUTHENTICATION */
const store = MongoStore.create({
    mongoUrl: db_url,
    crypto:{
        secret:"mysupersecretcode",
    },
    touchAfter:24*3600,
});
const sessionOptions = { 
    store,
    secret: "secretcode", 
    resave: false, 
    saveUninitialized: true, 
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, loginRegisterSchema.authenticate()));
passport.serializeUser(loginRegisterSchema.serializeUser());
passport.deserializeUser(loginRegisterSchema.deserializeUser());
/* SESSIONS OPTION FOR SESSIONS AND PASSPORT FOR LOGIN AUTHENTICATION END */





/* MIDDLEWARE FOR CONNECT FLASH */
// middle ware for connect flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
})
/* MIDDLEWARE END FOR CONNECT FLASH */






/* VIEW PATH SET FOR EACH FOLDER INSIDE VIEWS FOLDER */
const viewsPath = path.join(__dirname, "views");
const userViewsPath = path.join(__dirname, "views/userView");
const userRegistrationPath = path.join(__dirname, "views/userView/registration");
const userClientPanelPath = path.join(__dirname, "views/userView/clientPanel");
const adminViewsPath = path.join(__dirname, "views/adminView");
const adminAddPath = path.join(__dirname, "views/adminView/add");
const adminEditPath = path.join(__dirname, "views/adminView/edit");
const adminIndexPath = path.join(__dirname, "views/adminView/index");
const adminShowPath = path.join(__dirname, "views/adminView/show");
const adminContactPath = path.join(__dirname, "views/adminView/contactUs");
const adminAuthPath = path.join(__dirname, "views/adminView/auth");
const adminRegistrationListPath = path.join(__dirname, "views/adminView/registrationList");
const adminSpeakerPath = path.join(__dirname, "views/adminView/speaker");
app.set("views", [viewsPath, userViewsPath, userRegistrationPath, userClientPanelPath,
    adminViewsPath, adminAddPath, adminEditPath, adminIndexPath, adminShowPath, adminContactPath, adminAuthPath, adminRegistrationListPath, adminSpeakerPath]);
/* VIEW PATH SET FOR EACH FOLDER INSIDE VIEWS FOLDER */







/* USER ROUTES STARTS FROM HERE */
app.get("/", userController.index)
app.get("/about", userController.about)
app.get("/schedule", userController.schedule)
app.get("/contact", userController.contact))
app.post("/contact", userController.contactAdd)

app.get("/eventRegistration/:id", userController.eventRegistration))
app.post("/eventRegistration/:id", upload.single('event[fees]'), userController.eventRegistrationAdd)

app.get("/conferRegistration/:id", userController.conferRegistration))
app.post("/conferRegistration/:id", upload.single('confer[fees]'), userController.conferRegistrationAdd)

app.get("/webinarRegistration/:id", userController.webinarRegistration)
app.post("/webinarRegistration/:id", userController.webinarRegistrationAdd)

app.get("/workshopRegistration/:id", userController.workshopRegistration)
app.post("/workshopRegistration/:id", upload.single('workshop[fees]'), userController.workshopRegistrationAdd)
/* USER ROUTES ENDS HERE */






/* LOGIN AND SIGNUP , CHANGE PASSWORD PANEL FOR ADMIN STARTS HERE */
app.get("/admin", authController.adminLoginPage);
app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), authController.adminLoginCheck)
app.get("/signUp", authController.adminSignUpPage);
app.post("/signUp", authController.adminSignUpRegister)
app.get("/changePassword", AuthMiddle.isLoggedIn, authController.adminChangePasswordPage)
app.post("/changePassword/:id", AuthMiddle.isLoggedIn, authController.adminChangePasswordUpdate);
app.get("/logout", AuthMiddle.isLoggedIn, authController.adminLogout);
/* LOGIN AND SIGNUP , CHANGE PASSWORD PANEL FOR ADMIN ENDS HERE */








/* ADMIN ROUTES STARTS FROM HERE */
/* DASHBAORD ROUTE */
app.get("/dashboard", AuthMiddle.isLoggedIn, dashboardController.dashboard);
/* CONTACT US ROUTE */
app.get("/contactAdmin", AuthMiddle.isLoggedIn, dashboardController.contactUs)
app.get("/showContact/:id", AuthMiddle.isLoggedIn, dashboardController.showContact)
app.get("/deleteContact/:id", AuthMiddle.isLoggedIn, dashboardController.deleteContact)
app.get("/replyContact/:id", AuthMiddle.isLoggedIn, dashboardController.replyContact)
/* INDEX ROUTE */
app.get("/eventAdmin", AuthMiddle.isLoggedIn, eventController.index)
app.get("/conferAdmin", AuthMiddle.isLoggedIn, conferController.index)
app.get("/webinarAdmin", AuthMiddle.isLoggedIn, webinarController.index)
app.get("/workshopAdmin", AuthMiddle.isLoggedIn, workshopController.index)
/* UPDATE ROUTE */
app.get("/editEventAdmin/:id", AuthMiddle.isLoggedIn, eventController.editGet)
app.post("/editEventAdmin/:id", AuthMiddle.isLoggedIn, upload.single('event[photo]'), eventController.editPost)
app.get("/editConferAdmin/:id", AuthMiddle.isLoggedIn, conferController.editGet)
app.post("/editConferAdmin/:id", AuthMiddle.isLoggedIn, upload.single('confer[photo]'), conferController.editPost)
app.get("/editWebinarAdmin/:id", AuthMiddle.isLoggedIn, webinarController.editGet)
app.post("/editWebinarAdmin/:id", AuthMiddle.isLoggedIn, upload.single('webinar[photo]'), webinarController.editPost)
app.get("/editWorkshopAdmin/:id", AuthMiddle.isLoggedIn, workshopController.editGet)
app.post("/editWorkshopAdmin/:id", AuthMiddle.isLoggedIn, upload.single('workshop[photo]'), workshopController.editPost)
/* CREATE ROUTE */
app.get("/addEventAdmin", AuthMiddle.isLoggedIn, eventController.addGet)
app.post("/addEventAdmin", AuthMiddle.isLoggedIn, upload.single('event[photo]'), eventController.addPost)
app.get("/addConferAdmin", AuthMiddle.isLoggedIn, conferController.addGet)
app.post("/addConferAdmin", AuthMiddle.isLoggedIn, upload.single('confer[photo]'), conferController.addPost)
app.get("/addWebinarAdmin", AuthMiddle.isLoggedIn, webinarController.addGet)
app.post("/addWebinarAdmin", AuthMiddle.isLoggedIn, upload.single('webinar[photo]'), webinarController.addPost)
app.get("/addWorkshopAdmin", AuthMiddle.isLoggedIn, workshopController.addGet)
app.post("/addWorkshopAdmin", AuthMiddle.isLoggedIn, upload.single('workshop[photo]'), workshopController.addPost)
/* SHOW ROUTE */
app.get("/viewEventAdmin/:id", AuthMiddle.isLoggedIn, eventController.view)
app.get("/viewConferAdmin/:id", AuthMiddle.isLoggedIn, conferController.view)
app.get("/viewWebinarAdmin/:id", AuthMiddle.isLoggedIn, webinarController.view)
app.get("/viewWorkshopAdmin/:id", AuthMiddle.isLoggedIn, workshopController.view)
/* DELETE ROUTE */
app.get("/deleteEventAdmin/:id", AuthMiddle.isLoggedIn, eventController.destroyEvent)
app.get("/deleteConferAdmin/:id", AuthMiddle.isLoggedIn, conferController.destroyConfer)
app.get("/deleteWebinarAdmin/:id", AuthMiddle.isLoggedIn, webinarController.destroyWebinar)
app.get("/deleteWorkshopAdmin/:id", AuthMiddle.isLoggedIn, workshopController.destroyWorkshop)
/* REGISTRATION LIST ROUTE */
app.get("/registrationEventAdmin/:id", AuthMiddle.isLoggedIn, eventController.registrationEvent)
app.get("/registrationConferAdmin/:id", AuthMiddle.isLoggedIn, conferController.registrationConfer)
app.get("/registrationWebinarAdmin/:id", AuthMiddle.isLoggedIn, webinarController.registrationWebinar)
app.get("/registrationWorkshopAdmin/:id", AuthMiddle.isLoggedIn, workshopController.registrationWorkshop)
/* SPEAKER ROUTE */
app.get("/speakers", AuthMiddle.isLoggedIn, dashboardController.speakerIndex)
app.get("/addSpeaker", AuthMiddle.isLoggedIn, dashboardController.speakerAddGet)
app.post("/addSpeaker", AuthMiddle.isLoggedIn, upload.single('speaker[photo]'), dashboardController.speakerAddPost)
app.get("/speakerDelete/:id", AuthMiddle.isLoggedIn, dashboardController.speakerDelete)
/** ADMIN ROUTES ENDS HERE */





/* MIDDLE WARE FOR ERRORS */
app.use((err, req, res, next) => {
    let { statusCode = 400, message = "some error occurred" } = err;
    console.dir(err);
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(port);
