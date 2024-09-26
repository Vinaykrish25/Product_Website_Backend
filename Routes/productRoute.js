const express = require('express');
const { 
    getAllProducts, 
    createProducts, 
    getProductById, 
    updateProductById,    // Import the updateProductById function
    deleteProductById     // Import the deleteProductById function
} = require('../Controllers/productController');
const { protect, authorizeUser, authorizeProductOwner } = require('../Middlewares/authHandler');

// Create router for products
const productRouter = express.Router();

// Route to get all products (Admin can view all products)
productRouter.get('/', getAllProducts);

// Route to create a new product (Only admin can create products)
productRouter.post('/', protect, authorizeUser('admin'), createProducts);

// Route to update a product by ID (Only admin or product owner can update)
productRouter.patch('/:id', protect, authorizeUser('admin'), authorizeProductOwner, updateProductById);

// Route to delete a product by ID (Only admin or product owner can delete)
productRouter.delete('/:id', protect, authorizeUser('admin'), authorizeProductOwner, deleteProductById);

// Route to get a product by ID (Public access, no specific authorization required)
productRouter.get('/:id', getProductById);

module.exports = productRouter;
