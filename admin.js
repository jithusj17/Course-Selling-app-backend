const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const adminRouter = Router();
const { adminModel } = require("./db");


const ADMIN_SECRET = process.env.JWT_ADMIN_PASSWORD;

// --- ADMIN SIGNUP ---
adminRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Hash the admin password
        const hashedPassword = await bcrypt.hash(password, 10);
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        res.json({
            message: "Admin Signup succeeded"
        });
    } catch (e) {
        res.status(500).json({
            message: "Signup failed",
            error: e.message
        });
    }
});

// --- ADMIN SIGNIN ---
adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email: email });
        if (!admin) {
            return res.status(403).json({ message: "Admin not found" });
        }
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (passwordMatch) { 
            const token = jwt.sign({
                id: admin._id.toString()
            }, ADMIN_SECRET);

            res.json({
                token: token,
                message: "Admin login successful"
            });
        } else {
            res.status(403).json({ message: "Incorrect credentials" });
        }
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});

adminRouter.post("/course", function(req, res) {
    res.json({
        success: true,
        message: "Admin created course"
    })
})

adminRouter.put("/course", function(req, res) {
    res.json({
        success: true,
        message: "Admin created course"
    })
})

adminRouter.get('/course/bulk',adminMiddleware,async function (req,res) {
    const adminId = req.userId
    const courses = await courseModel.find({
        creator:adminId
    })
})



module.exports = {
    adminRouter
}