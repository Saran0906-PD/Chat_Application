import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"

import bcrypt from "bcryptjs"
import cloudinary from '../lib/cloudinary.js'


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        // Check for password length and if email already exists

        if (!fullName || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" })
        }
        if (password.toString().length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters" })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ msg: "User already exists" })
        }

        // password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedpassword
        })

        generateToken(newUser._id, res)
        await newUser.save()

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilepic,
        })
    }
    catch (err) {
        console.log("Error in signup controller", err.message)
        res.status(501).send({ msg: "Internal server Error" })

    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" })
        }
        const isPasswordcorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordcorrect) {
            return res.status(400).json({ msg: "Invalid credentials" })
        }
        generateToken(user._id, res)

        res.status(200).send({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilepic,
        })
    }
    catch (err) {
        console.log(`Error in login controller${err}`)
        res.status(500).send({ msg: "Internal Server error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ msg: "Logged out successfully" })
    }
    catch (err) {
        res.status(500).send({ msg: "Internal Server error" })
    }
}


export const updateprofile = async (req, res) => {

    try {
        const { profilepic } = req.body
        const userId = req.user._id

        if (!profilepic) {
            return res.status(400).send({ msg: "Profile Pic required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilepic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updatedUser)

    }

    catch (error) {
        console.log("Error in update profile pic", error)
        res.status(400).send({ msg: "Internal Server Error" })
    }


}

export const checkauth = (req, res) => {
    try {
        res.status(200).send(req.user)
    }
    catch (err) {
        console.log("Error in CheckAuth", err.message)
        res.status(500).json({ msg: "Internal server error" })
    }


}