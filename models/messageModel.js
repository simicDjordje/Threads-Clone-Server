import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        // maxLength: 500,
    },
    seen: {
        type: Boolean,
        default: false
    },
    photoId: {
        type: String,
        default: 'none'
    },
}, {timestamps: true})


const Message = mongoose.model('Message', messageSchema)

export default Message