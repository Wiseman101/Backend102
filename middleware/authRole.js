const authorise = (...allowedRoles) => {
    return (req,res,next) => {
        if(!allowedRoles.includes(req.role)){
            return res.status(403).json({message:"Forbidden"})
        }
        next();
    };
};
module.exports = authorise;