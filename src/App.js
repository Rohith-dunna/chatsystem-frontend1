import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthForm from './components/AuthForm';
import Chat from './components/Chat';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  // WebSocket Connection
  useEffect(() => {
    if (token && !wsRef.current) {
      wsRef.current = new WebSocket(`${process.env.REACT_APP_WS_URL}?token=${token}` || `ws://localhost:8080?token=${token}`);

      wsRef.current.onopen = () => console.log('WebSocket connected');

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'history') {
          setMessages(data.messages);
        } else if (data.type === 'message') {
          setMessages(prev => [...prev, data]);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        wsRef.current = null;
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [token]);

  // Handle Login
  const handleLogin = async (credentials) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login` || 'http://localhost:8080/api/login', credentials);
      setToken(res.data.token);
      setUsername(credentials.username);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      alert(error.response?.data?.error || 'Server error');
    }
  };

  // Handle Register
  const handleRegister = async (credentials) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/register` || 'http://localhost:8080/api/register', credentials);
      alert('Registration successful! Please login.');
    } catch (error) {
      alert(error.response?.data?.error || 'Server error');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setToken(null);
    setUsername('');
    setCurrentRoom(null);
    setMessages([]);
    localStorage.removeItem('token');
  };

  // Join Room
  const joinRoom = (roomId) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'join', roomId }));
      setCurrentRoom(roomId);
      setMessages([]);
    }
  };

  return token ? (
    <Chat
      username={username}
      currentRoom={currentRoom}
      messages={messages}
      joinRoom={joinRoom}
      sendMessage={(text) => wsRef.current?.send(JSON.stringify({ type: 'message', text }))}
      logout={handleLogout}
    />
  ) : (
    <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
  );
}

export default App;