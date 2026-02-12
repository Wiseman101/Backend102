require("dotenv").config();
const express = require("express");
const app = express();
const PORT =  8080;
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const connectDB = require("./config/db");

app.use(express.json());
const userRoutes = require('./routes/user');
const productRoutes = require("./routes/products.routes");
app.use('/users', userRoutes);
app.use('/products',productRoutes);



connectDB();
app.listen(PORT, () => {
    console.log(`Server live on port: ${PORT}`)
});