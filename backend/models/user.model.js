import mongoose from "mongoose";


const userschema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    fullName:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    profilePic:{
        type:String,
        default:"raju profile",
    }
},{timestamps:true})



const User = mongoose.model("User", userschema);

export default User;