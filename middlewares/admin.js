const jwt = require("jsonwebtoken");
require('dotenv').config(); 

    function adminMiddleware(req, res, next) {
        const token = req.headers.token;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
        if (decoded) { 
           req.adminId = decoded.id;  
           next(); 
        } else {
            res.status(403).json({ message: "Invalid Admin Token" });
        }
    } catch (e) {
        res.status(403).json({ message: "Session expired or invalid admin token" });
    }
}
module.exports = {
    adminMiddleware:adminMiddleware
};