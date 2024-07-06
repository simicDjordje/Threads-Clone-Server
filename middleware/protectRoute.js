import jwt from 'jsonwebtoken'
import { CustomError } from "./customErrorHandler.js"
import User from '../models/userModel.js'

const protectRoute = async (req, res, next) => {
   
    const token = req.cookies.jwt_token

    if(!token)throw new CustomError('Unauthorized', 401)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select('-password')

    if(!user)throw new CustomError('Unauthorized', 401)
    
    req.user = user
    
    next()

}


export default protectRoute