import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js"
import {getreceiverSocketId} from "../utils/socket.js"
import { io } from "../utils/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filterUsers);
  } catch (error) {
    console.log("error in getUserFor slidebar controller", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    })

    res.status(200).json(message)


  } catch (error) {
    console.log("error in getMessage controller", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const sendMessage= async(req,res)=>{
    try{
        const {text, image}= req.body;
        const {id:receiverId}= req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uplodeResponse=await cloudinary.uploader.upload(image.tempFilePath,{
                folder: "chatphoto"
            });
            imageUrl=uplodeResponse.secure_url;
        }

        const newMessage =Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })

        // todo realtime functionality goes here => socket.io
        const  receiverSocketId = getreceiverSocketId(receiverId)
        if(receiverSocketId){
          io.to(receiverSocketId).emit("newmessage",newMessage)
        }

        res.status(200).json(newMessage);
        
    }catch(error){
        console.log("error in sendMessage controller", error.message);
        return res.status(500).json({
          message: "Server error",
          error: error.message,
        });
    }

}
