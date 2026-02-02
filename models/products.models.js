const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending", "incomplete","active","dicontinued"], 
        default:["incomplete"]
    },
    date:{
        type:Date,
        default:Date.now
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("products", productSchema);