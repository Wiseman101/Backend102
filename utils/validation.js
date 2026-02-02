const joi = require("joi");
const bcrypt = require("bcryptjs")

const registerValidation =  data => {
    const schema = joi.object({
        name:joi.string().min(8).max(100).required(),
        email:joi.string().required().email(),
        password:joi.string().required().alphanum().min(6),
        role:joi.string()
    });


    return schema.validate(data);
} ;

const loginValidation = data => {
    const schema = joi.object({
        email:joi.string().required().email(),
        password:joi.string().required()
    });

    return schema.validate(data);
} ;

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;