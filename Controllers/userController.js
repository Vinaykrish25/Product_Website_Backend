const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');

// Generate JSON Web Token
const generateToken = (id, username, email, role) => {
    return jwt.sign({ id, username, email, role }, process.env.JSON_TOKEN, { expiresIn: "1h" });
}

// Show all users (consider pagination if needed)
exports.getAllUser = async (req, res, next) => {
    try {
        const showUsers = await userModel.find();
        res.status(200).json({
            status: "success",
            data: showUsers,
        });
    } catch (err) {
        next(err);
    }
}

// Register a new user
exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password, confirmpassword, role } = req.body;

        // Password match validation
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Assign 'admin' role if the email is "vinaykrish2002@gmail.com"
        const assignedRole = (email === "vinaykrish2002@gmail.com") ? 'admin' : (role || 'user');

        // Create the user (password will be hashed automatically)
        const newUser = await userModel.create({ username, email, password, role: assignedRole });
        const token = generateToken(newUser._id, newUser.username, newUser.email, newUser.role);

        // Set JWT in cookies
        res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
        res.status(201).json({
            status: "success",
            data: newUser
        });
    } catch (err) {
        next(err);
    }
};


// Login a user and generate a token
exports.loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Invalid username or password" });
        }
        // Compare provided password with stored hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        // Generate a token
        const token = generateToken(user._id, user.username, user.email, user.role);
        // Set JWT in cookies
        res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });
        res.status(200).json({
            message: "Login successful",
            token,
            data: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// Verify user JWT token
exports.verifyUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Token not found or invalid" });
    }
    try {
        const decodedData = jwt.verify(token, process.env.JSON_TOKEN);
        res.status(200).json({ status: "success", user: decodedData });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Verify if the logged-in user is an admin
exports.verifyAdmin = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JSON_TOKEN);
        // Check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        res.status(200).json({ message: "Admin access granted.", user: decoded });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Logout user by clearing the JWT cookie
exports.logoutUser = (req, res) => {
    res.cookie("jwt", "", { httpOnly: true });
    res.status(200).json({
        message: "Logout successful"
    });
};
