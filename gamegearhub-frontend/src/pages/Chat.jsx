import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Container, Form, Button } from 'react-bootstrap';

function Chat() {
  const { requestId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/chat/${requestId}/`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [requestId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axiosInstance.post(`/chat/${requestId}/`, { message: text });
      setText('');
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Chat</h2>
      <div className="border p-3 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <p key={msg.id} style={{ textAlign: msg.is_sender ? 'right' : 'left' }}>
            <strong>{msg.is_sender ? 'You' : 'Them'}:</strong> {msg.message}
            <br />
            <small className="text-muted">{new Date(msg.timestamp).toLocaleString()}</small>
          </p>
        ))}
      </div>
      <Form className="d-flex">
        <Form.Control
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
        />
        <Button variant="primary" onClick={sendMessage} className="ms-2">Send</Button>
      </Form>
    </Container>
  );
}

export default Chat;
