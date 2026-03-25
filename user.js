const { Router } = require("express");
require('dotenv').config();
const bcrypt = require('bcrypt'); // Added bcrypt for password hashing

const mySecret = process.env.JWT_USER_PASSWORD;
const { userModel } = require("./db");

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
  
    const { email, password, firstName, lastName } = req.body; 

    try {
      
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            email: email,
            password: hashedPassword, 
            firstName: firstName, 
            lastName: lastName
        });
     
        res.json({
            message: "Signup succeeded"
        });

    } catch (e) {
       
        console.error(e);
        res.status(500).json({
            message: "Error signing up. The user might already exist."
        });
    }
});


userRouter.post("/login", async function(req, res) {

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                message: "Invalid credentials (User not found)"
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({
                id: user._id.toString()
            }, mySecret); 
            res.json({
                token: token,
                message: "Login successful!"
            });
            
        } else {
            res.status(403).json({
                message: "Invalid credentials (Wrong password)"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

userRouter.get("/purchases", function(req,res){
    res.json({
        success:true,
        message:"User purchases route"
    })
})

module.exports = {
    userRouter
}