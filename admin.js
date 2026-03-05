const { Router } = require("express")

const adminRouter = Router()

adminRouter.post("/signup", function(req,res){
    res.json({
        success:true,
        message:"Admin signup route"
    })
})

adminRouter.post("/login", function(req,res){
    res.json({
        success:true,
        message:"Admin login route"
    })
})

adminRouter.post("/create-course", function(req,res){
    res.json({
        success:true,
        message:"Admin created course"
    })
})

module.exports = {
    adminRouter
}