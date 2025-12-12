import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from '../lib/socket.js';


export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUser = req.user._id ;
        const filteredUser = await User.find({_id : {$ne : loggedInUser}}).select("-password ")
        // console.log(filteredUser)
        res.status(200).json({filteredUser})
    } catch (error) {
        console.error("error in getUsersForSidebar controller", error.message);
        return res.status(500).json({message : "Internal Server error"});
    }
}

export const getMessagesBetweenUsers = async (req,res) => {
    try {
        const loggedInUser = req.user._id ;
        const otherUserId =  req.params.id;

        const messages = await Message.find({
            $or : [
                {senderId : loggedInUser , receiverId : otherUserId},
                {senderId : otherUserId , receiverId : loggedInUser}
            ]
        }).select("-password ");
        res.status(200).json({messages} )
    }
    catch(error){
        console.error("error in getMessagesBetweenUsers controller", error.message);
        return res.status(500).json({message : "Internal Server error"});
    }
}

export const sendMessageToUser = async (req,res) => {
    try {
        const {text, image} = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })
        await newMessage.save();

        const ReceiverSocketId = getReceiverSocketId(receiverId);
        if (ReceiverSocketId) {
            io.to(ReceiverSocketId).emit("newMessage", newMessage);
        }


        res.status(201).json({newMessage});


    } catch (error) {
        console.error("error in sendMessageToUser controller", error.message);
        return res.status(500).json({message : "Internal Server error"});
        
    }
};