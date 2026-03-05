const {Router} = require('express')

const courseRouter = Router()

courseRouter.post("/purchase",function(req,res){
    res.json({success:true,message:"successfully created the router for the course router"})
})

courseRouter.get('/preview',function(req,res){
    res.json({success:true,message:"created an route for the preview"})
})

module.exports = {
    courseRouter: courseRouter
}