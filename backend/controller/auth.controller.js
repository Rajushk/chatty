import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";

import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({
                message: "provide all details",
            });
        }
        console.log("first break point ")

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }
        console.log("second break point ")
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        // hash password
        console.log("third break point ")
        const hashPassword = await bcrypt.hash(password, 10);

        const Newuser = await User.create({
            email,
            fullName,
            password: hashPassword,
        });

        console.log("fourth break point ")
        if (Newuser) {
            const token = generateToken(Newuser._id, res);
            return res.status(201).json({
                message: "User created successfully",
                user: { email: Newuser.email, fullName: Newuser.fullName },
                token, // Send the token back to the client
                profilePic: Newuser.profilePic,
            });
        } else {
            return res.status(400).json({
                message: "Failed to create user",
            });
        }
        console.log("last break point ")
    } catch (error) {
        // Catch any error and return it
        console.log("error in signup break point ", error)
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "invalid credintial",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Password is incorrect",
            });
        }
        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        // Catch any error and return it
        console.log("error in login controller", error.message);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
export const signout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        return res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
        // Catch any error and return it
        console.log("error in logout controller", error.message);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const profilePic=req.files.image;
        const userId=req.user._id;

        console.log(profilePic) 


        if(!profilePic){
            return res.status(400).json({
                message: "profile pic is required",
            });
        }
        console.log("first break point")
        const uplodeResponse=await cloudinary.uploader.upload(profilePic.tempFilePath,{
            folder: "chatphoto",
            public_id: userId 
        });
        console.log("second break point")
        const UpdatedUser = await User.findByIdAndUpdate(userId,{profilePic:uplodeResponse.secure_url},{new:true})
        console.log("third break point")
        res.status(200).json(UpdatedUser)



    } catch (error) { 
         // Catch any error and return it
         console.log("error in update profile controller", error.message);
         return res.status(500).json({
             message: "Server error",
             error: error.message,
         });
    }
};


export const checkAuth=(req, res)=>{
    try{
        res.status(200).json(req.user);
        console.log(req.user);
    }catch(error){
        console.log("error in check auth controller", error.message);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}