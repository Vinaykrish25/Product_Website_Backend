const jwt = require('jsonwebtoken');
const productModel = require('../Models/productModel');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    const token = req.cookies.jwt;
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({
            message: "Not a valid token"
        });
    }

    try {
        // Verify the token
        const decodedData = jwt.verify(token, process.env.JSON_TOKEN);
        req.user = decodedData;
        next();
    } catch (err) {
        next(err);
    }
};

// Middleware to authorize specific users or roles
exports.authorizeUser = (role) => {
    return async (req, res, next) => {
        // Check if the user's role matches the required role
        if (role === 'admin') {
            if (req.user.role !== role) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        } else if (role === 'user') {
            if (req.user.role !== role) {
                return res.status(403).json({ message: "Access denied" });
            }
        }
        next();
    };
};

// Middleware to check if a user is allowed to manage a specific product
exports.authorizeProductOwner = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Check if the product owner matches the current user
        if (product.createdBy !== req.user.email) {
            return res.status(403).json({ message: "You are not authorized to manage this product" });
        }
        next();
    } catch (err) {
        next(err);
    }
};
