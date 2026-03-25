const { Router } = require("express")
const adminRouter = Router()

// ✅ import from db.js using require
const { adminModel, courseModel } = require("./db")

adminRouter.post("/signup", function(req, res) {
    res.json({
        success: true,
        message: "Admin signup route"
    })
})

adminRouter.post("/signin", function(req, res) {
    res.json({
        success: true,
        message: "Admin login route"
    })
})

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