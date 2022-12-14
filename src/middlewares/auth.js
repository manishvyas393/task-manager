const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
      try {
            const token = req.header("Authorization").replace("Bearer ", "")
            const decodeToken = jwt.verify(token, process.env.Token_secret)
            const user = await User.findOne({ _id: decodeToken.id, "tokens.token": token })
            if (!user) {
                  throw new Error()
            }
            req.token = token
            req.user = user;
            next()
      } catch (error) {
            res.status(401).json({
                  error: "please authenticate..."
            })
      }
}
module.exports = auth