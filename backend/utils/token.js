import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

export const generateToken=(userId, res)=>{

    const token= jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"2d"
    })

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"Strict",
        secure:process.env.NODE_ENV !=="development",
    })

    return token;
}