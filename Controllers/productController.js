const productModel = require('../Models/productModel');

// Show all products (Admin can view all products)
exports.getAllProducts = async (req, res, next) => {
    try {
        if(req.query){
            const queryObject = {...req.query}
            var filetered = await productModel.find(queryObject)
        }
        else{
            var filetered = await productModel.find();
        }
        res.status(200).json({
            status: "success",
            data: filetered,
        });
    } catch (err) {
        next(err);
    }
}

// Create a new product
exports.createProducts = async (req, res, next) => {
    try {
        const { product_name, product_description, product_price, product_rating, product_category, product_image } = req.body;
        // Validate required fields
        if (!product_name || !product_description || !product_price || !product_rating || !product_category || !product_image) {
            return res.status(400).json({
                status: "fail",
                message: "All fields are required"
            });
        }
        // Create the product
        const addProducts = await productModel.create({
            product_name,
            product_description,
            product_price,
            product_rating,
            product_category,
            product_image,
            createdBy: req.user.role  // Set the user who created the product
        });
        res.status(201).json({
            status: "success",
            data: addProducts
        });
    } catch (err) {
        next(err);
    }
}

// Get product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productData = await productModel.findById(id);
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            status: "success",
            data: productData
        });
    } catch (err) {
        next(err);
    }
}

// Update product by ID
exports.updateProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        // Find the product by ID and update
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            status: "success",
            data: updatedProduct
        });
    } catch (err) {
        next(err);
    }
}

// Delete product by ID
exports.deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Find the product by ID and delete
        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(204).json({
            status: "success",
            message: "Product deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}
