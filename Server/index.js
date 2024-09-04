const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const URI = process.env.MONGO_URI

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(URI);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/users', require('./routes/user_route'));
app.use('/tweets', require('./routes/tweet_route'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
