import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import chatService from '../../services/chat.service';

const QUICK_QUESTIONS = [
  "Find cheap medications near me",
  "What are common side effects?",
  "How to refill my prescription?",
  "Find 24-hour pharmacies"
];

const WELCOME_MESSAGE = `Hello! I'm your PharmaCare AI Assistant. I can help you with:

• Finding medications and their prices
• Understanding side effects and interactions
• Locating nearby pharmacies
• General health questions

How can I assist you today?`;

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: '17:48'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
  };

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: messageText,
      timestamp: getCurrentTime()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Logic for multi-turn history
      const history = messages.length > 1 ? messages.slice(1) : []; 
      const response = await chatService.sendMessage(messageText, history);
      
      const aiMessage = { 
        role: 'assistant', 
        content: response,
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: getCurrentTime()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-avatar">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
            <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"/>
            <circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/>
            <path d="M8 15h8"/>
          </svg>
        </div>
        <div>
          <h1>AI Assistant</h1>
          <p>Powered by PharmaCare Intelligence</p>
        </div>
      </header>

      <div className="message-list" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="ai-avatar-circle">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"/>
                <circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/>
                <path d="M8 15h8"/>
              </svg>
            </div>
            <div className="message-content">
              <div className="message-bubble">...</div>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <p className="quick-questions-label">Quick questions:</p>
        <div className="quick-questions">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button 
              key={idx} 
              className="quick-btn"
              onClick={() => handleSend(q)}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Ask me anything about medications, pharmacies, or health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            className="send-btn" 
            onClick={() => handleSend()}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
