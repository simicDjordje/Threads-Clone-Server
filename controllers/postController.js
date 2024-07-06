import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import {CustomError} from '../middleware/customErrorHandler.js'
import mongoose from 'mongoose'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getPost = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError('Post not found', 404)

    const post = await Post.findById(id)

    if(!post) throw new CustomError('Post not found', 404)

    res.status(200).json({success: true, message: 'Post found', result: post})
}

const createPost = async (req, res) => {
    const {text, photoId} = req.body
    
    if(!text) throw new CustomError('Text field is required', 400)
    const postedBy = req.user._id

    const newPost = new Post({postedBy, text, photoId})
    await newPost.save()

    res.status(200).json({success: true, message: 'Post created successfuly', result: newPost})
}   

const deletePost = async (req, res) => {
    const {id} = req.params
    const post = await Post.findByIdAndDelete(id)

    if(!post) throw new CustomError('Post not found', 404)

    if(post.photoId !== 'none'){
        console.log(1)
        const filePath = path.join(__dirname, '..', 'uploads', `post-photo${post.photoId}.png`)
        console.log(filePath)
        console.log(2)
        fs.unlink(filePath)
            .then(() => {
                console.log('File deleted successfully');
            })
            .catch((err) => {
                console.error('Error deleting file:', err);
            })
    }
    
    res.status(200).json({success: true, message: 'Post deleted succesffully', result: post})
}

const likePost = async (req, res) => {
    const {id} = req.params
    const userId = req.user._id
    const post = await Post.findById(id)

    if(!post) throw new CustomError('Post not found', 404)

    await post.updateOne({$push: {likes: userId}})

    res.status(200).json({success: true, message: 'Liked'})
}

const unlikePost = async (req, res) => {
    const {id} = req.params
    const userId = req.user._id
    const post = await Post.findById(id)

    if(!post) throw new CustomError('Post not found', 404)

    await post.updateOne({$pull: {likes: userId}})

    res.status(200).json({success: true, message: 'Unliked'})
}

const replyToPost = async (req, res) => {
    const {id} = req.params
    const {text} = req.body
    
    const userId = req.user._id
    const username = req.user.username

    const post = await Post.findById(id)
    if(!post) throw new CustomError('Post not found', 404)
    const reply = {userId, text, username}
    post.replies.push(reply)
    await post.save()

    res.status(200).json({success: true, message: 'Replied', result: reply})
}

const getFeedPosts = async (req, res) => {
    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user) throw new CustomError('User not found', 404)

    const following = user.following
    const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1})

    res.status(200).json({success: true, result: feedPosts})
}

const getUserPosts = async (req, res) => {
    const {username} = req.params
    const user = await User.findOne({username})
    if(!user){
        throw CustomError('User not found', 400)
    }
    const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1})

    res.status(200).json({success: true, result: posts})
}

export {
    getPost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    replyToPost,
    getFeedPosts,
    getUserPosts
}