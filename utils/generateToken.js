import jwt from 'jsonwebtoken'

const generateTokenCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15d'})

    res.cookie('jwt_token', token, {
        httpOnly: true, //access only by server and not browser js
        maxAge: 15 * 24 * 60 * 60 * 1000, //15days in ms
        sameSite: 'strict'
    })

    return token
}

export default generateTokenCookie