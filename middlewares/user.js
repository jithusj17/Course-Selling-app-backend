const jwt = require("jsonwebtoken");
require('dotenv').config(); 

function userMiddleware(req, res, next) {
    
    const token = req.headers.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
        if (decoded) { 
           req.userId = decoded.id;  
            next(); 
        } else {
            res.status(403).json({
                message: "Invalid Token"
            });
        }
    } catch (e) {
        res.status(403).json({
            message: "Session expired or invalid token"
        });
    }
}

module.exports = {
   userMiddleware:userMiddleware
};