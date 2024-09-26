const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create schema name as userSchema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "username should not be empty"],
        minLength: [5, "username length should be at least 5"],  // Corrected from 10 to 5
        maxLength: [20, "username length should be at most 20"], // Corrected from 15 to 20
    },
    email: {
        type: String,
        unique: true,
        required: [true, "email should not be empty"],
        minLength: [5, "email length should be at least 5"], // Corrected from 15 to 5
        maxLength: [50, "email length should be at most 50"], // Corrected from 30 to 50
    },
    password: {
        type: String,
        required: [true, "password should not be empty"], // Corrected from newpassword to password
        minLength: [8, "password length should be at least 8"],
        maxLength: [20, "password length should be at most 20"], // Corrected from 15 to 20
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { collection: "users" });

// Encrypt password before saving the user model
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to validate password during login
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Create model name as userModel
const userModel = mongoose.model('User', userSchema); // Use 'User' for model name

// Export model
module.exports = userModel;
