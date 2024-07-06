import express from 'express'
import multer from 'multer'
import { 
    getUserProfile,
    signupUser, 
    loginUser, 
    logoutUser, 
    followUser, 
    unfollowUser, 
    updateUser
} from '../controllers/userController.js'
import protectRoute from '../middleware/protectRoute.js'
import storage from '../uploads/multerStorageConf.js'

const router = express.Router()
const upload = multer({storage})

router.get('/profile/:query', getUserProfile)
router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id', protectRoute, followUser)
router.post('/unfollow/:id', protectRoute, unfollowUser)
router.post('/update', protectRoute, upload.single('profile-photo'), updateUser)


export default router