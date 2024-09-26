const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productRouter = require('./Routes/productRoute');  // Import product routes
const userRouter = require('./Routes/userRoute');        // Import user routes
const { errorHandler } = require('./Middlewares/errorHandler'); // Import error handler
const { protect, authorizeUser } = require('./Middlewares/authHandler');

// Configure dotenv
dotenv.config();

// Connect to the database
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

// Declare a name for the server
const app = express();

// Usage of middlewares
app.use(express.json());              // Parse JSON bodies
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));                                  // Provide permission to access server from port 3000 and handle cookies
app.use(cookieParser());

// Protect the /products route for authorized users only
app.use('/products', productRouter);  // Only "admin" can manage products

// Protect user-related routes to allow only the authenticated user to handle their own data
app.use('/users', userRouter);

// Error handling middleware
app.use(errorHandler);

// Ensure the server runs continuously
app.listen(5000, () => {
    console.log("Server connected successfully on port 5000");
});
