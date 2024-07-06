import express from 'express'
import multer from 'multer'
import {getPost, createPost, deletePost, likePost, unlikePost, replyToPost, getFeedPosts, getUserPosts} from '../controllers/postController.js'
import protectRoute from '../middleware/protectRoute.js'
import storage from '../uploads/multerStorageConf.js'


const router = express.Router()
const upload = multer({storage})


router.get('/feed', protectRoute, getFeedPosts)
router.route('/:id').get(getPost).delete(deletePost)
router.get('/user/:username', getUserPosts)
router.post('/create', protectRoute, upload.single('post-photo'), createPost)
router.put('/like/:id', protectRoute, likePost)
router.put('/unlike/:id', protectRoute, unlikePost)
router.post('/reply/:id', protectRoute, replyToPost)
export default router