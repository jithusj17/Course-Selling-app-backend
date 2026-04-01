const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();

// Import Routers
const { courseRouter } = require("./course");
const { adminRouter } = require("./admin");
const { userRouter } = require("./user");

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

// MongoDB Connection Logic
async function main() {
    try {
        // 1. Attempt initial connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to MongoDB");
        // 2. Handle errors that happen AFTER the initial connection
        mongoose.connection.on('error', err => {
            console.error(" MongoDB runtime error:", err);
        });
        // 3. Start Express Server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB on startup:", error.message);
        process.exit(1); // Stop the script if DB fails
    }
}

main();
