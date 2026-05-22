import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const adminRouter = express.Router();

adminRouter.post("/login", async (req,res)=>{

    try {

        const {email,password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:"User not found"
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        )

        if(!isMatch){
            return res.json({
                success:false,
                message:"Invalid Password"
            })
        }

        // IMPORTANT
        if(!user.isAdmin){
            return res.json({
                success:false,
                message:"You are not Admin"
            })
        }

        const token = jwt.sign(
            {
                id:user._id,
                role:"admin"
            },
            process.env.JWT_SECRET
        )

        res.json({
            success:true,
            token
        })

    } catch (error) {

        console.log(error);

        res.json({
            success:false,
            message:"Error"
        })
    }

})

export default adminRouter;