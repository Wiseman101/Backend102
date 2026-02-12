const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../utils/validation");

const registerUser = async (req,res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const userExist = await User.findOne({email});
    if(userExist) return res.status(400).json({message:"User with that email already exists"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        role:req.body.role
    });

    try {
        const savedUser = await user.save();
        res.status(201).json({
            success:true,savedUser,message:"User saved successful in the database"
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"An error occured while saving the user",
            Error:err.message
        });
    }
};

const loginUser = async (req,res) => {
    try{
    const {error} = loginValidation(req.body);
    if (error) return res.send(error.details[0].message);

    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(401).send("Invalid credentials");
    

    const correctPass = await bcrypt.compare(req.body.password,user.password);
    if(!correctPass) return res.status(401).send("Invalid credentials");

    const accessToken = jwt.sign({id:user._id, role:user.role}, process.env.SECRET_TOKEN,{expiresIn:"30sec"});
    const refreshToken = jwt.sign({id:user._id,role:user.role},process.env.REFRESH_TOKEN,{expiresIn:"3d"});

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge: 7*24*60*60*1000 
    });

    res.status(200).json({
        success:true,
        message:"Login successful...",
        accessToken
    });

    } catch (err) {
        res.status(500).json({
            message:"Internal server error",
            Error:err.message
        });
    }

}

const UserRefreshToken = async(req,res) => {
    const token = req.cookies.refreshToken;
    if(!token) return res.status(401).send("No refresh token provided");

    try{
        const decoded = jwt.verify(token,process.env.REFRESH_TOKEN);
        const user = await User.findById(decoded.id);
        if(!user || user.refreshToken !== token) {
            return res.status(403).json({message:"Invalid Token"});
        };

        const newAcessToken = jwt.sign({id:user._id,email:user.email,role:user.role},process.env.SECRET_TOKEN,{expiresIn:"1.5min"});

        res.status(200).json({ newAcessToken })
    } catch (err) {
        res.status(403).json({message:"Token expired"});
    }
};

const logout = async (req,res) => {
    const token = req.cookies.refreshToken;
    if(token) {
        const user = await User.findOne({refreshToken:token});
        if(user) {
            user.refreshToken = null;
            await user.save();
        }
    }
    res.clearCookie("refreshToken");
    res.json({message:"Logged out successful..."})
}

module.exports = {registerUser,loginUser,UserRefreshToken,logout};


