const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer"))
    return res.sendStatus(401);
   try{
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,process.env.SECRET_TOKEN);
    req.user = decoded;
    next();
    } catch (err) {
        return res.sendStatus(403)
    }
}

module.exports = authMiddleware;