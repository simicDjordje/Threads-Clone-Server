class CustomError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof CustomError){
        console.log(err.message)
        return res.status(err.statusCode).json({success: false, message: err.message})
    }
    console.log(err.message)
    return res.status(500).json({success: false, message: 'Something went wrong'})
}


export {CustomError, errorHandlerMiddleware}