const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        .then(console.log("MongoDB connected succesful✅"));
    } catch (err) {
        console.log(err.message)
        process.exit(1);
    }
}

module.exports = connectDB;