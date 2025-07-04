import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Container, Form, Button, Image } from 'react-bootstrap';

function Chat() {
  const { requestId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/requests/${requestId}/chat/`); // ✅ FIXED
      setMessages(res.data);
    } catch (err) {
      console.error('❌ Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [requestId]);

  const sendMessage = async () => {
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append('message', text);
    if (image) formData.append('image', image);

    try {
      await axiosInstance.post(`/requests/${requestId}/chat/`, formData, { // ✅ FIXED
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText('');
      setImage(null);
      fetchMessages();
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Secure Chat</h2>

      <div
        className="border rounded p-3 mb-4"
        style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}
      >
        {messages.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ textAlign: msg.is_sender ? 'right' : 'left' }}>
              <p className="mb-1">
                <strong>{msg.is_sender ? 'You' : msg.sender_email}:</strong> {msg.message}
              </p>
              {msg.image && (
                <Image
                  src={msg.image}
                  alt="Chat Image"
                  thumbnail
                  style={{ maxWidth: '180px', marginTop: '5px' }}
                />
              )}
              <small className="text-muted">{new Date(msg.timestamp).toLocaleString()}</small>
              <hr />
            </div>
          ))
        )}
      </div>

      <Form className="d-flex flex-column flex-md-row gap-2">
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button onClick={sendMessage} variant="primary">
          Send
        </Button>
      </Form>
    </Container>
  );
}

export default Chat;