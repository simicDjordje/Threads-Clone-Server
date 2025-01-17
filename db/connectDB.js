import mongoose from "mongoose"

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
    }catch(error){
        console.log(error)
        process.exit()
    }
}

export default connectDB