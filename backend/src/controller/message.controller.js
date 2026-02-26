import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReciverSocketId , io} from "../lib/Socket.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).send(filteredUser)
    } catch (err) {
        console.log("Error in getUserForSidebar", err.message)
        res.status(500).send({ msg: "Internavl Server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).send(messages)
    }
    catch (err) {
        console.log("Error In Getmessage", err.message)
        res.status(500).send({ msg: "Internal Server Error" })

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        // todo: real time functionality goes her sockite.io
        const reciverSocketId = getReciverSocketId(receiverId)
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {

        console.log("Error in sending of image", error.message)
        res.status(500).send({ msg: "internal server error" })
    }
}