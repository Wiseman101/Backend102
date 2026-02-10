const express = require("express");
const router = express.Router()
const {getUsers, createUser, loginUser, updateUser, deleteUser, checkRefreshToken} = require("../controllers/user.controllers");
const authorise = require("../middleware/authRole");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", getUsers);
router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/refresh",checkRefreshToken)
router.patch("/login/:id", updateUser);
router.delete("/login/:id", deleteUser);

router.get('/admin', authMiddleware, authorise('admin','user'),(req,res) =>{
    res.json({
        message:"Welcome user",
        user:req.user
    });
});

module.exports = router;