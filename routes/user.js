const express = require("express");
const router = express.Router()
const {getUsers, updateUser, deleteUser } = require("../controllers/user.controllers");
const authorise = require("../middleware/authRole");
const authMiddleware = require("../middleware/authMiddleware");
const { registerUser, loginUser, UserRefreshToken, logout } = require("../controllers/authController");

router.get("/", getUsers);
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/refresh",UserRefreshToken);
router.post("/logout",logout)
router.patch("/login/:id", updateUser);
router.delete("/login/:id", deleteUser);

router.get('/admin', authMiddleware, authorise('admin','user'),(req,res) =>{
    res.json({
        message:"Welcome user",
        user:req.user
    });
});

module.exports = router;