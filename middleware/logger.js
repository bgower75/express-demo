
//calling a custom middleware function for logging
function log(req, res, next) {
    console.log("Logging....");
    next(); //call this to prevent the request from hanging due to the request response cycle not being terminated
}

module.exports = log;