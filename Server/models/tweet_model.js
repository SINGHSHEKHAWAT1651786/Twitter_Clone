const mongoose = require('mongoose'); // Import Mongoose library

// Define the Tweet schema
const TweetSchema = new mongoose.Schema({
  tweetedBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', // Specifies the model to which this field refers
    required: true // This field is mandatory
  },
  content: {
    type: String, // The content of the tweet
    required: true // This field is mandatory
  },
  image: {
    type: String // Optional field for an image URL associated with the tweet
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, // Array of User IDs who liked the tweet
    ref: 'User' // Specifies the model to which this field refers
  }],
  retweetBy: [{ 
    type: mongoose.Schema.Types.ObjectId, // Array of User IDs who retweeted the tweet
    ref: 'User' // Specifies the model to which this field refers
  }],
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, // Array of Tweet IDs that are replies to this tweet
    ref: 'Tweet' // Specifies the model to which this field refers
  }],
  date: {
    type: Date, // Timestamp of when the tweet was created
    default: Date.now // Default value is the current date and time
  },
  isReply: { 
    type: Boolean, // Indicates if the tweet is a reply to another tweet
    default: false // Default value is false
  },
});

// Create the Tweet model from the schema
const Tweet = mongoose.model('Tweet', TweetSchema);

// Export the Tweet model
module.exports = Tweet;
