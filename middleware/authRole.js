const authorise = (...allowedRoles) => {
    return (req,res,next) => {
        if(!req.role) {
            return res.sendStatus(401)
        }
        const isAuthorised = allowedRoles.includes(req.role);
        if(!isAuthorised) return res.status(403).json({message:"Access Forbidden"});
        next();
    };
};
module.exports = authorise;