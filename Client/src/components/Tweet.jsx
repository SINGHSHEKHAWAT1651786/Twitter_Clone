import React, { useState } from 'react'; // Importing React and the useState hook
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import { FaHeart, FaComment, FaRetweet } from 'react-icons/fa'; // Importing FontAwesome icons
import Image from 'react-bootstrap/Image'; // Importing Image component from react-bootstrap
import '../sass/Tweet.scss'; // Importing custom Sass styles for the Tweet component
import axios from 'axios'; // Importing axios for making HTTP requests

// Defining the base URL for the API, with a fallback to localhost if not defined in the environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Main Tweet component
const Tweet = ({ _id, content, image, tweetedBy, date, likes, retweetBy, replies }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Parsing user data from localStorage
  const userId = user ? user._id : null; // Extracting the user ID
  const username = user ? user.username : null; // Extracting the username
  const navigate = useNavigate(); // Hook for programmatic navigation

  // State variables for managing likes, retweets, and replies
  const [liked, setLiked] = useState(likes.includes(userId)); // Whether the user has liked the tweet
  const [retweeted, setRetweeted] = useState(retweetBy.includes(userId)); // Whether the user has retweeted the tweet
  const [likesCount, setLikesCount] = useState(likes.length); // Count of likes
  const [retweetsCount, setRetweetsCount] = useState(retweetBy.length); // Count of retweets
  const [repliesCount, setRepliesCount] = useState(replies.length); // Count of replies

  // Function to handle the like action
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.put(`${API_URL}/tweets/like/${_id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, // Send token in the request headers
      });
      setLiked(!liked); // Toggle liked state
      setLikesCount(response.data.likes.length); // Update the likes count
    } catch (error) {
      console.error('Failed to like the tweet', error); // Log any errors
    }
  };

  // Function to handle the retweet action
  const handleRetweet = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.put(`${API_URL}/tweets/retweet/${_id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, // Send token in the request headers
      });
      setRetweeted(!retweeted); // Toggle retweeted state
      setRetweetsCount(response.data.retweetBy.length); // Update the retweets count
    } catch (error) {
      console.error('Failed to retweet', error); // Log any errors
    }
  };

  // Function to handle clicking on the tweet, navigating to the tweet details page
  const handleTweetClick = () => {
    navigate(`/tweets/${_id}`); // Navigate to the tweet details page
  };

  // Function to handle clicking on the profile, navigating to the user's profile page
  const handleProfileClick = () => {
    if (tweetedBy._id === userId) {
      navigate(`/profile`); // Navigate to the logged-in user's profile
    } else {
      navigate(`/users/${tweetedBy._id}`); // Navigate to the tweeted user's profile
    }
  };

  // Handle null values for profile picture and user information
  const profilePicUrl = tweetedBy?.profilePic ? `${API_URL}/${tweetedBy.profilePic}` : "/assets/default_user.jpg"; // Set profile picture URL or fallback to default
  const tweetedByUsername = tweetedBy?.username || 'Unknown_User'; // Set username or fallback to 'Unknown_User'
  const tweetedByName = tweetedBy?.name || 'Unknown User'; // Set name or fallback to 'Unknown User'

  return (
    <div className="tweet">
      {retweeted && (
        <div className="retweet-label">
          {/* Label indicating the tweet was retweeted by the current user */}
          <FaRetweet /> Retweeted by {username}
        </div>
      )}
      <div className="tweet-header">
        {/* Header of the tweet, including the user's profile picture and tweet information */}
        <Image src={profilePicUrl} alt="Profile" className="tweet-profile-pic" />
        <div className="tweet-info" onClick={handleProfileClick}>
          <span className="tweet-name">{tweetedByName}</span> {/* Display user's name */}
          <span className="tweet-handle">@{tweetedByUsername}</span> {/* Display user's handle */}
          <span className="tweet-date">· {new Date(date).toLocaleDateString()}</span> {/* Display tweet date */}
        </div>
      </div>
      <div className="tweet-content" onClick={handleTweetClick}>{content}</div> {/* Tweet content */}
      {image && <Image src={`${API_URL}/${image}`} alt="Tweet" className="tweet-image" />} {/* Tweet image, if available */}
      <div className="tweet-actions">
        {/* Actions bar for liking, commenting, and retweeting the tweet */}
        <div className="tweet-action" onClick={handleLike}>
          <FaHeart className={`tweet-icon ${liked ? 'hearted' : ''}`} /> {likesCount} {/* Like button */}
        </div>
        <div className="tweet-action" onClick={handleTweetClick}>
          <FaComment className="tweet-icon" /> {repliesCount} {/* Comment button */}
        </div>
        <div className="tweet-action" onClick={handleRetweet}>
          <FaRetweet className={`tweet-icon ${retweeted ? 'retweeted' : ''}`} /> {retweetsCount} {/* Retweet button */}
        </div>
      </div>
    </div>
  );
};

export default Tweet; // Export the Tweet component as the default export
