import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define your storage path here
    },
    filename: (req, file, cb) => {
        const userId = req.user._id // Assuming userId is sent along with the file
        let fileName
        if(file.fieldname === 'profile-photo'){
            fileName = `profile-photo${userId}.png`; // Constructing the filename
        }else if(file.fieldname == 'post-photo'){
            const {photoId} = req.body
            fileName = `post-photo${photoId}.png`
        }else if(file.fieldname == 'message-photo'){
            const {photoId} = req.body
            fileName = `message-photo${photoId}.png`
        }else{
            fileName = `other${userId}.png`
        }

        cb(null, fileName);
    },
})

export default storage