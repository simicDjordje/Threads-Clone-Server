import bcrypt from 'bcryptjs'

import User from "../models/userModel.js"
import {CustomError} from '../middleware/customErrorHandler.js'
import generateTokenCookie from '../utils/generateToken.js'
import mongoose from 'mongoose'


const getUserProfile = async (req, res) => {
    //query is eather username or id
    const {query} = req.params

    let user
    if(mongoose.Types.ObjectId.isValid(query)){
        user = await User.findOne({_id: query}).select("-password").select("-updatedAt")
    }else{
        user = await User.findOne({username: query}).select("-password").select("-updatedAt")
    }

    if(!user) throw new CustomError('User not found', 404)

    res.status(200).json({success: true, message: 'Success', result: user})
}


const signupUser = async (req, res) => {
    const {name, email, username, password} = req.body
    const user = await User.findOne({ $or: [{ email }, { username }] })
    
    if(user){
        throw new CustomError('User already exists', 400)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword
    })

    await newUser.save()

    if(newUser){
        generateTokenCookie(newUser._id, res)
        res.status(201).json({success: true, message: 'Account created successfully', result: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
        }})
    }else{
        throw new CustomError('Invalid user data', 400)
    }
}


const loginUser = async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

    if(!user || !isPasswordCorrect){
        throw new CustomError('Invalid username or password', 400)
    }

    generateTokenCookie(user._id, res)
    res.status(200).json({success: true, message: 'Welcome', result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
    }})

}

const logoutUser = async (req, res) => {
    res.cookie('jwt_token', '', {maxAge: 1})
    res.status(200).json({success: true, message: 'Logged out successfully'})
}

const followUser = async (req, res) => {
    const {id} = req.params
    const userToFollow = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()) throw new CustomError('You cannot follow yourself', 400)

    if(!userToFollow || !currentUser) throw new CustomError('User not found', 400)

    await userToFollow.updateOne({$push: {followers: req.user._id}})
    await currentUser.updateOne({$push: {following: id}})

    res.status(200).json({success: true, message: 'Successfully followed user'})

}

const unfollowUser = async (req, res) => {
    const {id} = req.params
    const userToUnfollow = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()) throw new CustomError('You cannot unfollow yourself', 400)

    if(!userToUnfollow || !currentUser) throw new CustomError('User not found', 400)

    await userToUnfollow.updateOne({$pull: {followers: req.user._id}})
    await currentUser.updateOne({$pull: {following: id}})

    res.status(200).json({success: true, message: 'Successfully unfollowed user'})
}

const updateUser = async (req, res) => {
    const {name, email, username, password, bio} = req.body
    const userId = req.user._id
    let user = await User.findById(userId)
    
    if(password){
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(password, salt)
        user.password = password
    }
    user.name = name || user.name
    user.email = email || user.email
    user.username = username || user.username
    user.bio = bio || user.bio

    user = await user.save()
    res.status(200).json({success: true, message: 'Profile updated successfully', result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
    }})

}



export {
    getUserProfile,
    signupUser, 
    loginUser, 
    logoutUser, 
    followUser, 
    unfollowUser, 
    updateUser,
}