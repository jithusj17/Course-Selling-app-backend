const express = require("express")
const app = express()
// import router
const { courseRouter } = require("./courseRouter")

app.use(express.json())

// use router
app.use("/api", courseRouter)

app.listen(3000, () => {
    console.log("Server running on port 3000")
})