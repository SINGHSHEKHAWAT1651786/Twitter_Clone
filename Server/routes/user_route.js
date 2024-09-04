const express = require('express');
const router = express.Router();
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');
const multer = require('multer')
const path = require('path')
const fs = require('fs')


// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });


// Register user
router.post('/register', async (req, res) => {
  const { username, email, password, name, dob, location } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      name,
      dob,
      location,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.dob = req.body.dob || user.dob;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


// update profile picture
router.put('/profile/pic', protect, upload.single('profilePic'), async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Remove old profile picture if exists
    if (user.profilePic && fs.existsSync(user.profilePic)) {
      fs.unlinkSync(user.profilePic);
    }

    user.profilePic = req.file.path;

    const updatedUser = await user.save();

    res.json({
      profilePic: updatedUser.profilePic
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Follow a user
router.post('/follow/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.id);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.following.includes(targetUser._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    user.following.push(targetUser._id);
    targetUser.followers.push(user._id);

    await user.save();
    await targetUser.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user
router.post('/unfollow/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.id);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = user.following.filter(id => id.toString() !== targetUser._id.toString());
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await targetUser.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get another user's profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers').populate('following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
