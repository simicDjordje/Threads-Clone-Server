import mongoose from "mongoose"


const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastMessage: {
        message: String,
        sender: {type: mongoose.Schema.Types.ObjectId},
        seen: {
            type: Boolean,
            default: false
        },
    }
}, {timestamps: true})


const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation