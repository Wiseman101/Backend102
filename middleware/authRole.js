const authorise = (...allowedRoles) => {
    return (req,res,next) => {
        console.log("User roles:", req.user.role);
        console.log("Allowed roles:", allowedRoles);
        if(!req.user || !allowedRoles.includes(req.user.role)){
            console.log("An error occured here, no role matches the requsted role");
            return res.status(403).json({message:"Forbidden"})
        }
        console.log("Success✅");
        next();
    };
};
module.exports = authorise;

