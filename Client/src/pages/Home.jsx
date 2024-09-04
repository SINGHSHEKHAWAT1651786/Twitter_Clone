import React, { useState, useEffect } from 'react'; // Import React and hooks
import Button from 'react-bootstrap/Button'; // Import Button component from react-bootstrap
import Modal from 'react-bootstrap/Modal'; // Import Modal component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Import Form component from react-bootstrap
import { FaImage } from 'react-icons/fa'; // Import image icon from react-icons
import { ToastContainer, toast } from 'react-toastify'; // Import toast components for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import default styles for toast notifications
import axios from 'axios'; // Import axios for HTTP requests
import '../sass/Home.scss'; // Import custom Sass styles for the Home component
import Tweet from '../components/Tweet'; // Import Tweet component

// Base URL for API requests, with a fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  // State for managing modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for storing new tweet content
  const [newTweetContent, setNewTweetContent] = useState('');
  // State for storing new tweet image
  const [newTweetImage, setNewTweetImage] = useState(null);
  // State for storing fetched tweets
  const [tweets, setTweets] = useState([]);

  // Fetch tweets on component mount
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get(`${API_URL}/tweets`); // GET request to fetch tweets
        setTweets(response.data); // Update state with fetched tweets
      } catch (err) {
        console.error('Failed to fetch tweets', err); // Log errors
      }
    };

    fetchTweets();
  }, []); // Empty dependency array means this runs once on mount

  // Handle posting a new tweet
  const handleNewTweet = async () => {
    if (!newTweetContent) {
      toast.error('Tweet content is required'); // Show error if content is empty
      return;
    }

    const formData = new FormData(); // Create form data for the tweet
    formData.append('content', newTweetContent); // Add tweet content to form data
    if (newTweetImage) {
      formData.append('image', newTweetImage); // Add image to form data if available
    }
    const token = localStorage.getItem('token'); // Get token from localStorage

    try {
      const response = await axios.post(`${API_URL}/tweets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Set authorization header with token
        },
      });

      setTweets([response.data, ...tweets]); // Add new tweet to the beginning of the list
      setShowModal(false); // Close the modal
      setNewTweetContent(''); // Clear tweet content
      setNewTweetImage(null); // Clear selected image
      toast.success('Tweet posted successfully'); // Show success message
    } catch (err) {
      console.error('Failed to post tweet', err); // Log errors
      toast.error('Failed to post tweet'); // Show error message
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setNewTweetImage(e.target.files[0]); // Set selected image
  };

  return (
    <div className="home">
      {/* Header with a button to open the modal */}
      <div className="home-header">
        <h2>Home</h2>
        <Button className='me-2' variant="primary" onClick={() => setShowModal(true)}>
          Tweet
        </Button>
      </div>

      {/* Display tweets or a message if no tweets are available */}
      <div className="tweets">
        {tweets.length === 0 ? (
          <div className="no-tweets-info">
            <p>No tweets available.</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <Tweet key={tweet._id} {...tweet} /> // Render each tweet
          ))
        )}
      </div>

      {/* Modal for creating a new tweet */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTweetContent">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's happening?"
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)} // Update tweet content
              />
            </Form.Group>
            {newTweetImage && (
              <div className="image-preview-container">
                <img src={URL.createObjectURL(newTweetImage)} alt="Selected" className="tweet-image-preview" />
              </div>
            )}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <FaImage size={24} cursor="pointer" /> {/* Image icon */}
                <Form.Control type="file" className="d-none" onChange={handleImageChange} /> {/* File input for image */}
              </Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewTweet}>
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer /> {/* Container for toast notifications */}
    </div>
  );
};

export default Home; // Export Home component as default
