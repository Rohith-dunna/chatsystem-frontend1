import React, { useState } from 'react';

function Chat({ username, currentRoom, messages, joinRoom, sendMessage, logout }) {
  const [input, setInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Community Chat - {username}</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="mb-4 flex gap-2">
        {['course1', 'course2', 'course3'].map(roomId => (
          <button
            key={roomId}
            onClick={() => joinRoom(roomId)}
            className={`px-4 py-2 rounded-lg ${currentRoom === roomId ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {roomId.charAt(0).toUpperCase() + roomId.slice(1)}
          </button>
        ))}
      </div>
      {currentRoom ? (
        <>
          <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}>
                <span className="text-sm text-gray-500">{msg.sender}: </span>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === username ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {msg.text}
                </span>
                <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">Select a chat room to start chatting.</p>
      )}
    </div>
  );
}

export default Chat;