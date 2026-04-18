import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="ai-avatar-circle">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"/>
            <circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/>
            <path d="M8 15h8"/>
          </svg>
        </div>
      )}
      <div className="message-content">
        <div className="message-bubble">
          {message.content}
        </div>
        {message.timestamp && (
          <div className="timestamp">{message.timestamp}</div>
        )}
      </div>
      {isUser && (
        <div className="avatar" style={{ marginLeft: '1rem', background: '#e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#64748b">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
