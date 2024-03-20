const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');
    // console.log("before"+authHeader)
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1].trim();
    // console.log("hii"+token)
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {

        decodedToken = jwt.verify(token, 'nishar1933');
        
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    console.log("auth complete")
    next();
}