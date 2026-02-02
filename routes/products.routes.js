console.log("All products looded successful")
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorise = require("../middleware/authRole")
const { findProducts, findOneProduct, postNewProduct, updateProduct, deleteProduct } = require("../controllers/products.controllers");
const router = express.Router();



router.get("/",authMiddleware,findProducts);
router.get("/:id",authMiddleware,findOneProduct);
router.post("/",authMiddleware,postNewProduct);
router.patch("/:id",authMiddleware,updateProduct);
router.delete("/:id",authMiddleware,authorise("admin"),deleteProduct);

module.exports = router;