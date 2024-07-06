import {CustomError} from '../middleware/customErrorHandler.js'
import Conversation from '../models/conversationModel.js'
import Message from '../models/messageModel.js'
import { getRecipientSocketId, io } from '../socket/socket.js'

const sendMessage = async (req, res) => {
    const {recipientId, message, photoId} = req.body
    const senderId = req.user._id

    let conversation = await Conversation.findOne({
        participants: {$all: [senderId, recipientId]}
    })

    if(!conversation){
        conversation = new Conversation({
            participants: [senderId, recipientId],
            lastMessage: {
                message: message,
                sender: senderId
            }
        })

        conversation.save()
    }

    const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        message: message,
        photoId: photoId
    })

    await Promise.all([
        newMessage.save(),
        conversation.updateOne({
            lastMessage: {
                message: message,
                sender: senderId
            }
        })
    ])

    const recipientSocketId = getRecipientSocketId(recipientId)
    console.log('recipientSocketId: ', recipientSocketId)
    
    const newMessageObj = {
        message: message,
        sender: senderId,
        sender_username: req.user.username,
        conversationId: conversation._id,
        photoId: newMessage.photoId,
    }
    if(recipientSocketId) io.to(recipientSocketId).emit('newMessage', newMessageObj)

    res.status(201).json({success: true, message: 'Message sent', result: newMessage})
}


const getMessages = async (req, res) => {
    const {otherUserId} = req.params
    const senderId = req.user._id

    const conversation = await Conversation.findOne({
        participants: {$all: [senderId, otherUserId]}
    })

    const messages = await Message.find({
        conversationId: conversation._id
    }).sort({createdAt: 1})

    res.status(200).json({success: true, message: 'All messages between these users', result: messages})
}

const getConversations = async (req, res) => {
    const userId = req.user._id

    const conversations = await Conversation.find({participants: userId}).populate({path: 'participants', select: 'username'}).sort({createdAt: -1})

    res.status(200).json({success: true, message: 'Your conversations', result: conversations})
}

export {sendMessage, getMessages, getConversations}