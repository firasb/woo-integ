module.exports.authenticate = (req, res, next) => {
    let clientID = req.headers["CLIENT_ID"] || req.headers["client_id"] || "";
    let clientSecret = req.headers["CLIENT_SECRET"] || req.headers["client_secret"] || "";

    if(clientID.trim().length == 0 || clientSecret.trim().length == 0) {
        next({
            code: 500,
            message: "Credentials were not supplied"
        });
        return;
    }

    if(clientID == "123" && clientSecret == "456") {
        next();
        return;
    }
    next({
        code: 401,
        message: "Invalid credentials"
    })
}