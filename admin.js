const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const { adminMiddleware } = require("./middlewares/admin.js");

const adminRouter = Router();

const { adminModel, courseModel } = require("./db"); 

const ADMIN_SECRET = process.env.JWT_ADMIN_PASSWORD;

//  ADMIN SIGNUP 
adminRouter.post("/signup", async function(req, res) {
    console.log("1. Route Hit!");
    const { email, password, firstName, lastName } = req.body;
    console.log("2. Data received:", { email, firstName, lastName });

    try {
        console.log("3. Starting Bcrypt...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("4. Bcrypt Finished!");

        console.log("5. Touching Database...");
        const result = await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
        console.log("6. Database Success!", result._id);

        return res.json({ message: "Signup worked!" });

    } catch (e) {
        console.log("!!! ERROR OCCURRED:", e.message);
        return res.status(500).json({ error: e.message });
    }
});

//  ADMIN SIGNIN
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

//  CREATE COURSE 
adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.adminId; // Matches your middleware key
    const { title, description, imageUrl, price } = req.body;
    
    try {
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
    } catch (e) {
        res.status(500).json({ message: "Error creating course" });
    }
});

//  UPDATE COURSE
adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const result = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title,
        description,
        imageUrl,
        price
    });

    if (result.matchedCount > 0) {
        res.json({ message: "Course updated successfully" });
    } else {
        res.status(403).json({ message: "Course not found or unauthorized" });
    }
});

// GET ALL MY COURSES 
adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.adminId;

   
    const courses = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        message: "Courses fetched successfully",
        courses: courses // Send the list of courses
    });
});


module.exports = {
    adminRouter: adminRouter
};