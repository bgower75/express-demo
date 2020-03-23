//calling a custom middleware function for authentication
function authenticate(req, res, next) {
    console.log("authenticating.....");
    next();
}

module.exports = authenticate;