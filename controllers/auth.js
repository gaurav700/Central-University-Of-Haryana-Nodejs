const loginRegisterSchema = require("../models/loginRegisterSchema.js");

module.exports.adminLoginCheck = (req, res) => {
    req.flash("success", "Welcome to Admin! You are logged in");
    let redirectUrl = res.locals.redirectUrl;
    if (redirectUrl) {
        res.redirect(res.locals.redirectUrl);
    }
    else {
        res.redirect("/dashboard");
    }
}

module.exports.adminSignUpRegister = async (req, res) => {
        try {
                const { email, username, password } = req.body;
                const newUser = new loginRegisterSchema({ email, username });
                const registeredUser = await loginRegisterSchema.register(newUser, password);
                req.login(registeredUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    req.flash("success", "Signup Successful, Welcome to Admin");
                    res.redirect("/dashboard");
                })
            } catch (err) {
                console.error(err);
                if (err.name === "UserExistsError") {
                    req.flash("error", "Email you entered is already exist");
                } else {
                    req.flash("error", "Failed to register. Please try again.");
                }
                res.redirect("/signUp");
            }
}

module.exports.adminLoginPage = (req, res) => {
        res.render("login.ejs");
};

module.exports.adminSignUpPage = (req, res) => {
        res.render("signup.ejs");
};

module.exports.adminChangePasswordPage = async(req, res) => {
        if(req.isAuthenticated()){
                res.locals.currUser = req.user._id;
        }
        const userInfo = await loginRegisterSchema.findById(res.locals.currUser);
        res.render("changepass.ejs", {userInfo});
}

module.exports.adminChangePasswordUpdate = async(req, res) => {
        let { id } = req.params;
        let { password } = req.body;
        let user = await loginRegisterSchema.findById(id);
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/admin");
        }
        user.setPassword(password, async function(err) {
            if (err) {
                req.flash("error", "Failed to update password");
                return res.redirect("/admin");
            }
            await user.save();
            req.flash("success", "Password updated successfully! Login agin to enter admin panel");
            res.redirect("/admin");
        });
};
    
module.exports.adminLogout = (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Logout successfully");
            res.redirect("/admin");
        })
    }