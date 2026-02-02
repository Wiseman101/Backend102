const express = require("express");
const router = express.Router()
const {getUsers, createUser, loginUser, updateUser, deleteUser, checkRefreshToken} = require("../controllers/user.controllers");

router.get("/", getUsers);
router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/refresh",checkRefreshToken)
router.patch("/login/:id", updateUser);
router.delete("/login/:id", deleteUser)

module.exports = router;