const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
import { adminMiddleware } from "./middlewares/admin";

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

adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;
    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId 
    });

    res.json({
        message: "Course created",
        courseId: course._id
    });
});



// 2. UPDATE A COURSE
adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;
    const { title, description, imageUrl, price, courseId } = req.body;

   
    const result = await courseModel.updateOne({
        _id: courseId,      // "Which course?"
        creatorId: adminId  // "Do you own it?"
    }, {
        title,
        description,
        imageUrl,
        price
    });

    if (result.matchedCount > 0) {
        res.json({ message: "Course updated successfully" });
    } else {
        // If courseId is wrong OR if another admin tries to edit it
        res.status(403).json({ message: "Course not found or unauthorized" });
    }
});


adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;

    const course = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        message: "Course updated",
        courseId: course._id
    })
})

module.exports = {
    adminRouter: adminRouter
}


module.exports = {
    adminRouter
}