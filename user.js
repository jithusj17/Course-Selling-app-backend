const { Router } = require("express")

const userRouter = Router()

userRouter.post("/signup", function(req,res){
    res.json({
        success:true,
        message:"User signup route"
    })
})

userRouter.post("/login", function(req,res){
    res.json({
        success:true,
        message:"User login route"
    })
})

userRouter.get("/purchases", function(req,res){
    res.json({
        success:true,
        message:"User purchases route"
    })
})

module.exports = {
    userRouter
}