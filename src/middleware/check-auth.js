const jwt = require("jsonwebtoken")
const environment = require("../config/environment")

module.exports = (req, res , next) => {
        try{
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, environment.JWT_KEY)
        req.userData = decoded
        next()
        
    }catch{
            return res.status(401).json({ message: "Not authorized"})
        }
}