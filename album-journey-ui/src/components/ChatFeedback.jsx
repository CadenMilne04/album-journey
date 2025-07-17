import { useState, useEffect, useRef } from 'react';
import './ChatFeedback.css';

const ChatFeedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initial message from "Caden" after a delay
    const timer = setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: "Hey! 👋 I'm Caden, the creator of AlbumAI. I'd love to hear your thoughts on the app! Any feedback would be super helpful.",
          sender: 'caden',
          timestamp: new Date()
        }
      ]);
      setHasNewMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Submit feedback to API
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: 5, // Default rating since this is conversational
          feedback: inputValue,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Simulate typing delay (1.5 seconds)
      setTimeout(() => {
        setIsTyping(false);
        const thankYouMessages = [
          "Thanks so much for the feedback! 🙏 This really helps me improve AlbumAI.",
          "I really appreciate you taking the time to share your thoughts! 😊",
          "This is super helpful! Thanks for helping me make AlbumAI better! 🎵",
          "Awesome feedback! I'll definitely keep this in mind for future updates! 💪"
        ];
        
        const randomThankYou = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
        
        const cadenReply = {
          id: Date.now() + 1,
          text: randomThankYou,
          sender: 'caden',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, cadenReply]);
      }, 1500);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setTimeout(() => {
        setIsTyping(false);
        
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, there was an issue submitting your feedback. But I still appreciate you taking the time to share! 😅",
          sender: 'caden',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  return (
    <div className="chat-feedback">
      {/* Profile picture button */}
      <div className={`chat-avatar ${isOpen ? 'open' : ''}`} onClick={openChat}>
        <img src="/headshot.jpeg" alt="Caden Milne" className="avatar-img" />
        {hasNewMessage && !isOpen && <div className="notification-badge">2</div>}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <img src="/headshot.jpeg" alt="Caden Milne" className="chat-header-avatar" />
              <div className="chat-header-text">
                <div className="chat-header-name">Caden Milne</div>
                <div className="chat-header-status">Creator • Online</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === 'caden' && (
                  <img src="/headshot.jpeg" alt="Caden" className="message-avatar" />
                )}
                <div className="message-bubble">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message caden">
                <img src="/headshot.jpeg" alt="Caden" className="message-avatar" />
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your feedback..."
              className="chat-input-field"
            />
            <button 
              onClick={handleSend} 
              disabled={!inputValue.trim()}
              className="chat-send-btn"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatFeedback;
