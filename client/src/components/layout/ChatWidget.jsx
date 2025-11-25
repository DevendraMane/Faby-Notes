import { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import { useAuth } from "../../store/Auth";

const ChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Faby, your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const messagesEndRef = useRef(null);
  const { API } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch predefined questions on component mount
  useEffect(() => {
    fetchPredefinedQuestions();
  }, []);

  const fetchPredefinedQuestions = async () => {
    try {
      const response = await fetch(`${API}/api/dialogflow/questions`);
      const data = await response.json();
      if (data.success) {
        setPredefinedQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const sendMessageToDialogflow = async (message) => {
    try {
      const response = await fetch(`${API}/api/dialogflow/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending message to Dialogflow:", error);
      return {
        success: false,
        message: "Sorry, I'm having trouble connecting. Please try again.",
        suggestions: [],
      };
    }
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (textToSend.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    setShowQuestions(false);

    // Send message to Dialogflow
    const response = await sendMessageToDialogflow(textToSend);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: response.message,
        sender: "bot",
        timestamp: new Date(),
        suggestions: response.suggestions || [],
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuestionClick = (questionText) => {
    handleSendMessage(questionText);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-widget-overlay">
      <div className="chat-widget">
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="chat-logo">
              <img
                src="/images/faby-logo.png"
                alt="Faby"
                className="chat-logo-img"
              />
            </div>
            <div className="chat-title">
              <h3>Faby Assistant</h3>
              <span className="chat-status">Online</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {message.sender === "bot" &&
                  message.suggestions &&
                  message.suggestions.length > 0 && (
                    <div className="suggestions">
                      <p className="suggestions-title">You might also ask:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="suggestion-btn"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {/* Show predefined questions initially */}
          {showQuestions && predefinedQuestions.length > 0 && (
            <div className="predefined-questions">
              <div className="questions-title">Quick Questions:</div>
              <div className="questions-grid">
                {predefinedQuestions.map((question) => (
                  <button
                    key={question.id}
                    className="question-btn"
                    onClick={() => handleQuestionClick(question.text)}
                  >
                    {question.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <div className="chat-input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="chat-input"
              // autoFocus
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputMessage.trim()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
