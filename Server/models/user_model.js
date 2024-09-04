const mongoose = require('mongoose'); // Import Mongoose library
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String, // Username field
    required: true, // This field is mandatory
    unique: true // This field must be unique across all users
  },
  email: {
    type: String, // Email field
    required: true, // This field is mandatory
    unique: true // This field must be unique across all users
  },
  password: {
    type: String, // Password field
    required: true // This field is mandatory
  },
  name: {
    type: String, // Name field
    required: true // This field is mandatory
  },
  dob: {
    type: Date // Date of birth field
  },
  location: {
    type: String // Location field
  },
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, // Array of user IDs following this user
    ref: 'User' // Specifies the model to which this field refers
  }],
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, // Array of user IDs that this user is following
    ref: 'User' // Specifies the model to which this field refers
  }],
  profilePic: {
    type: String // Optional field for profile picture URL
  }
});

// Middleware to hash the password before saving a user
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next(); // Proceed to save the user
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare passwords
};

// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

// Export the User model
module.exports = User;
