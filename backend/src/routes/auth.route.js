import express from "express"
import {
    login,
    logout,
    signup,
    updateprofile,
    checkauth
} from "../controller/auth.controller.js"

import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateprofile)
router.get("/check", protectRoute, checkauth)

export default router
