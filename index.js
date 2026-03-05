const express = require("express")

const { courseRouter } = require("./course")
const { adminRouter } = require("./admin")
const { userRouter } = require("./user")

const app = express()

app.use(express.json())

app.use("/api/v1/course", courseRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/user", userRouter)

app.listen(3000, () => {

    console.log("Server running on port 3000")

})