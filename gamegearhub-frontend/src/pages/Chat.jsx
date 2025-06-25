import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

function Chat() {
  const { requestId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [refresh, setRefresh] = useState(false);

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
    const interval = setInterval(fetchMessages, 3000); // Auto-refresh every 3s
    return () => clearInterval(interval);
  }, [requestId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axiosInstance.post(`/chat/${requestId}/`, { message: text });
      setText('');
      setRefresh(!refresh); // trigger fetch
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg) => (
          <p key={msg.id} style={{ textAlign: msg.is_sender ? 'right' : 'left' }}>
            <strong>{msg.is_sender ? 'You' : 'Them'}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
