const mongoose = require('mongoose');

// Create schema name as productSchema
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        unique: true,
        required: [true, "product_name should not be empty"],
    },
    product_description: {
        type: String,
        required: [true, "product_description should not be empty"],
        maxLength: [500, "product_description length should be at most 500 characters"], // Increased maxLength for better description
    },
    product_price: {
        type: Number,
        required: [true, "product_price should not be empty"],
        min: [200, "product_price should be at least 200 rupees"]
    },
    product_rating: {
        type: Number,
        required: [true, "product_rating should not be empty"],
        min: [3, "product_rating should be at least 3"],
        max: [10, "product_rating should be at most 10"]
    },
    product_category: {
        type: String,
        required: [true, "product_category should not be empty"],
    },
    product_image: {
        type: String,
        required: [true, "product_image should not be empty"],
    },
    createdBy: {
        type: String,
        required: [true, "Product must have a creator"],
    }     
}, { collection: "products" });

// Create model name as productModel
const productModel = mongoose.model('Product', productSchema); // Use 'Product' for model name

// Export model
module.exports = productModel;
