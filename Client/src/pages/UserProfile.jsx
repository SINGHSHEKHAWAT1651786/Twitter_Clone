import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { FaCalendarAlt, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import axios from 'axios';
import '../sass/Profile.scss'; // Import styles for the profile page
import Tweet from '../components/Tweet'; // Import Tweet component

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // API base URL

const UserProfile = () => {
  const { id } = useParams(); // Extract user ID from URL parameters
  const [user, setUser] = useState(null); // State to hold user profile data
  const [userTweets, setUserTweets] = useState([]); // State to hold user's tweets
  const [isFollowing, setIsFollowing] = useState(false); // State to check if the current user is following the profile user

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve auth token from local storage

    // Fetch the user's profile data
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        fetchUserTweets(response.data._id); // Fetch the user's tweets
        checkFollowingStatus(response.data._id); // Check if the current user is following this user
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };

    // Fetch the tweets of the user
    const fetchUserTweets = async (userId) => {
      try {
        const response = await axios.get(`${API_URL}/tweets/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserTweets(response.data);
      } catch (err) {
        console.error('Failed to fetch user tweets', err);
      }
    };

    // Check if the current user is following the profile user
    const checkFollowingStatus = async (userId) => {
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(response.data.following.includes(userId));
      } catch (err) {
        console.error('Failed to check following status', err);
      }
    };

    fetchUserProfile();
  }, [id]); // Fetch profile data when the user ID changes

  // Handle follow/unfollow actions
  const handleFollow = async () => {
    const token = localStorage.getItem('token'); // Retrieve auth token from local storage

    try {
      if (isFollowing) {
        // Unfollow the user
        await axios.post(`${API_URL}/users/unfollow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Follow the user
        await axios.post(`${API_URL}/users/follow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsFollowing(!isFollowing); // Toggle following state
    } catch (error) {
      console.error('Failed to follow/unfollow user', error);
    }
  };

  if (!user) {
    // Render loading state if user data is not yet fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <div className="profile-cover">
        <div className="profile-header">
          {/* Display profile picture if available */}
          {user.profilePic && <Image className='profile-pic' src={`${API_URL}/${user.profilePic}`} alt="Profile" roundedCircle />}
          <div className="profile-actions">
            {/* Button to follow/unfollow the user */}
            <Button variant={isFollowing ? 'secondary' : 'dark'} onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>
      <div className="profile-details">
        <h2 className='profile-name'>{user.name}</h2>
        <div className='profile-handle'>@{user.username}</div>
        <div className="profile-info">
            {/* Display user information */}
            <div><FaMapMarkerAlt /> {user.location}</div>
            <div><FaBirthdayCake /> {new Date(user.dob).toLocaleDateString()}</div>
            <div><FaCalendarAlt /> Joined {new Date(user.joined).toLocaleDateString()}</div>
        </div>
          <div className="follow-info">
            {/* Display follow and follower counts */}
            <span>{user.following.length} Following</span>
            <span>{user.followers.length} Followers</span>
          </div>
      </div>
      <div className="tweets-section">
        {/* Display user's tweets */}
        {userTweets.map(tweet => (
          <Tweet key={tweet._id} {...tweet} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
