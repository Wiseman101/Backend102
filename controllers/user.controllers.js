const User = require("../models/user.models");
const bcrypt = require("bcryptjs");


const getUsers = async (req,res) => {
    const allUser = await User.find();
    res.send(allUser);
};



const updateUser = async (req,res) => {
    const {id} = req.params;
   const updates = req.body;
   const updatedUser = await User.findByIdAndUpdate(id,updates, {new:true});
   if(!updatedUser) return res.send("User doesn't exist");
   res.send("User updated successful")
};


const deleteUser = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete({_id:req.params.id});
        if(!user) return res.status(404).json({message:"User not found❌"})
        res.status(200).send("User deleted successful✅🎉");
    } catch (err) {
        res.json(err.message)
    }
    
}

module.exports = {getUsers,updateUser,deleteUser};