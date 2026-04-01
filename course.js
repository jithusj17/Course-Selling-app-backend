const {Router} = require('express')

const courseRouter = Router()

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;
    //  Check if already purchased
    const alreadyPurchased = await purchaseModel.findOne({
        userId,
        courseId
    });
    if (alreadyPurchased) {
        return res.status(400).json({
            message: "You have already purchased this course"
        });
    }
    //  If not purchased, create new entry
    await purchaseModel.create({
        userId,
        courseId
    });

    res.json({
        message: "You have successfully bought the course"
    });
});

courseRouter.get("/preview", async function(req, res) {
    
    const courses = await courseModel.find({});

    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}