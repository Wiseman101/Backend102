

const products = require("../models/products.models");

const postNewProduct = async (req,res) => {
    const product = new products({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        status:req.body.status,
        user:req.user.id
    });

try{
    const savedProduct = await product.save();
    res.status(201).json(savedProduct)
} catch (error) {
    res.status(400).json({message:error.message});
    return res.status(500).json("Server crushed",error.message);
}
};

const findProducts = async (req,res) => {
    const allProducts =  await products.find();
    res.json(allProducts);
};

const findOneProduct = async (req,res) => {
    try {
        const oneProduct = await products.findById({_id:req.params.id});
        if(!oneProduct) return res.status(404).json({details:"Such product doesn't exist"});
        res.status(200).json(oneProduct)
    } catch (error) {
        res.json(error.message)
    }
} ;

const deleteProduct = async (req,res) => {
    const product = await products.findOne({_id:req.params.id,user:req.user.id});
    if(!product) return res.status(404).json({message:"Product not found"});
    await product.deleteOne();
    res.json({message:"Product deleted successful✅"});
};

const updateProduct = async (req,res) => {
    try {
    const updates = req.body;
    const product = await products.findByIdAndUpdate(req.params.id,updates,{new:true});
    if(!product) return res.status(404).json({message:"Product not found"});
    res.send("Product updated successful🎉");
    } catch (err) {
        return res.status(500).send("Server crushed",err.message);
    }

}

module.exports = {postNewProduct,findOneProduct,findProducts,deleteProduct,updateProduct}