import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Tweet from '../components/Tweet';
// import '../sass/TweetDetails.scss'; // Uncomment if styling is needed

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TweetDetails = () => {
  const { id } = useParams(); // Get tweet ID from URL parameters
  const [tweet, setTweet] = useState(null); // State for the tweet details
  const [replies, setReplies] = useState([]); // State for the replies
  const [replyContent, setReplyContent] = useState(''); // State for the new reply content
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    // Fetch tweet details and replies when the component mounts
    const fetchTweetDetails = async () => {
      try {
        // Fetch tweet details
        const response = await axios.get(`${API_URL}/tweets/${id}`);
        setTweet(response.data);

        // Fetch replies to the tweet
        const repliesResponse = await axios.get(`${API_URL}/tweets/${id}/replies`);
        setReplies(repliesResponse.data);
      } catch (err) {
        console.error('Failed to fetch tweet details', err);
      }
    };

    fetchTweetDetails();
  }, [id]); // Dependency array includes `id` to refetch data if the ID changes

  const handleReply = async () => {
    // Validate reply content
    if (!replyContent) {
      alert('Reply content is required');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve auth token
    try {
      // Post the new reply
      const response = await axios.post(
        `${API_URL}/tweets/${id}/replies`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send auth token in request headers
          },
        }
      );

      // Update replies state with the new reply
      setReplies([response.data, ...replies]);
      setReplyContent(''); // Clear the reply content
    } catch (err) {
      console.error('Failed to post reply', err);
      alert('Failed to post reply');
    }
  };

  return (
    <div className="tweet-details">
      <h3 className='ms-2 my-3'>Tweet</h3>

      {/* Display the tweet or a loading message */}
      {tweet ? (
        <Tweet {...tweet} />
      ) : (
        <p>Loading tweet...</p>
      )}

      <div className="replies-section">
        {/* Form for submitting replies */}
        <Form className="ms-2 reply-form">
          <Form.Group controlId='formReplyContent'>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder='Write your reply...'
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </Form.Group>
          <Button className='mt-2' variant='primary' onClick={handleReply}>Reply</Button>
        </Form>

        {/* Display replies or a message if there are no replies */}
        {replies.length === 0 ? (
          <p>No replies yet.</p>
        ) : (
          replies.map((reply) => <Tweet key={reply._id} {...reply} />)
        )}
      </div>
    </div>
  );
};

export default TweetDetails;
