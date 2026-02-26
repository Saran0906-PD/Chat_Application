import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized User" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return res.status(400).send({ msg: "User Not Found" })
        }
        req.user = user
        next()
    }
    catch (err) {
        res.status(500).send({ msg: "Internal Server Error" })
    }
}