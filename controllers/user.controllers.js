const users = require("../models/user.models");
const {registerValidation,loginValidation} = require("../utils/validation")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req,res) => {
    const allUser = await users.find();
    res.send(allUser);
};

const createUser = async (req,res) => {

    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const userExist = await users.findOne({email:req.body.email});
    if(userExist) return res.status(400).send("User with that email already exist")
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt) 

    const  user = new users({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        role:req.body.role
    });
    try {
        const savedUser = await user.save()
        res.status(201).json(savedUser)
    }
    catch (error) {
        return res.status(400).json({message: "Error posting user"})
    }
};

const loginUser = async (req,res) => {
    try {
    const {error} = loginValidation(req.body);
    if(error) return res.send(error);

    const user = await users.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Invalid User")

    const correctPass = await bcrypt.compare(req.body.password, user.password);
    if(!correctPass) return res.status(400).send("Incorrect creditentials");
    
    const payLoad = {
        id:user._id,
        role:user.role
    }

    const accessToken = jwt.sign(payLoad,process.env.SECRET_TOKEN,{expiresIn:"15min"});
    const refreshToken = jwt.sign(payLoad,process.env.REFRESH_TOKEN, {expiresIn:"3d"});
    res.cookie("jwt",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 7*24*60*1000
    });

   res.status(200).json({
    success:true,
    accessToken
   });
} catch (err) {
    res.status(500).json({message:err.message});
}  
};

const checkRefreshToken = (req,res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN,(err,decoded) => {
        if(err) {
            return res.sendStatus(403)
        };
        const accessToken = jwt.sign({id:decoded.id,role:decoded.role},process.env.REFRESH_TOKEN,{expiresIn:"10min"});
        res.json({accessToken,role:decoded.role})
    });
};

const updateUser = async (req,res) => {
    const {id} = req.params;
   const updates = req.body;
   const updatedUser = await users.findByIdAndUpdate(id,updates, {new:true});
   if(!updatedUser) return res.send("User doesn't exist");
   res.send("User updated successful")
};

const deleteUser = async (req,res) => {
    try {
        const user = await users.findByIdAndDelete({_id:req.params.id});
        if(!user) return res.status(404).json({message:"User not found❌"})
        res.status(200).send("User deleted successful✅🎉");
    } catch (err) {
        res.json(err.message)
    }
    
}

module.exports = {getUsers,createUser,loginUser,checkRefreshToken,updateUser,deleteUser};