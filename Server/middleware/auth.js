const jwt = require('jsonwebtoken'); // Import the JSON Web Token library
const User = require('../models/user_model'); // Import the User model

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID (decoded from the token) and exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Log the error and send a 401 response if token verification fails
      console.error('Not authorized, token failed');
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is provided in the Authorization header
    if (!token) {
      console.log('No token provided');
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }
};

module.exports = { protect };
