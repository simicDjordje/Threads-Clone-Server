import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { sendMessage, getMessages, getConversations } from '../controllers/chatController.js'
import multer from 'multer'
import storage from '../uploads/multerStorageConf.js'

const router = express.Router()
const upload = multer({storage})

router.get('/conversations', protectRoute, getConversations)
router.get('/:otherUserId', protectRoute, getMessages)
router.post('/send', protectRoute, upload.single('message-photo'), sendMessage)

export default router