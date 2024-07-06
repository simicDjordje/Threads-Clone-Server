import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {app, server} from './socket/socket.js'

import connectDB from './db/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import {errorHandlerMiddleware} from './middleware/customErrorHandler.js'


dotenv.config()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


//Routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/photos', express.static(path.join(__dirname, 'uploads')))
app.use(errorHandlerMiddleware)

connectDB()
server.listen(PORT, ()=>{
    console.log(`Server is listening on port: ${PORT}`)
})