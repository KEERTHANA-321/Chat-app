import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("error in getuser controller",err);
        res.status(500).json({message:"server error"});
    }
}

export const getMessages=async(req,res)=>{
    try{
        const {id:usertochatId}=req.params;
        const senderId=req.user._id;
        const userMessages=await Message.find({
            $or:[
                {senderId:senderId,receiverId:usertochatId},
                {senderId:usertochatId,receiverId:senderId}
            ]
        });
        res.status(200).json(userMessages);
    }catch(err){
        console.log("error in getmessage controller",err);
        res.status(500).json({message:"server error"});
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const {id:usertochatId}=req.params;
        const senderId=req.user._id;
        const {text,image}=req.body;
        let imageUrl;
        if(image){
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId:usertochatId,
            text,
            image:imageUrl,
        });
        newMessage.save();


        //realtime functionality
        const receiverId = usertochatId;

        const recieverSocketId=getRecieverSocketId(receiverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage);
        }
        res.status(200).json(newMessage);


    }catch(err){e
        console.log("error in sendmessage controller",err);
        res.status(500).json({message:"server error"});
    }
}

