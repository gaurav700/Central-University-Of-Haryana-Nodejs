
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be loggedin First");
        res.redirect("/admin");
    } else {
        next(); // Call next() to proceed to the next middleware or route handler
    }
};
