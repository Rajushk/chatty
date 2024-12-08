import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import env from "dotenv";

env.config();
export const protectRoute = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({
                message:"unauthorized - NO Token Provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({
                message:"unauthorized - Invalid token"
            })
        }

        const user =await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        req.user= user;
        next();

    }catch(error){
        console.error("Error in auth middlerware", error.message);  // Log the error for debugging
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }

}