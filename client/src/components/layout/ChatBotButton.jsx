"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import ChatWidget from "./ChatWidget";
import "./ChatBotButton.css";

const ChatBotButton = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Only show on / route
  if (location.pathname !== "/") {
    return null;
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* <h1>this is it...</h1> */}
      <div className="chatbot-button-container">
        <button
          className={`chatbot-button ${isChatOpen ? "active" : ""}`}
          onClick={toggleChat}
          aria-label="Open chat assistant"
        >
          {isChatOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <img
              src="/images/faby-logo.png"
              alt="ChatBot"
              className="chatbot-icon"
            />
          )}
        </button>
        {!isChatOpen && (
          <div className="chat-notification">
            <span>Chat with Faby!</span>
          </div>
        )}
      </div>
      <ChatWidget isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
};

export default ChatBotButton;
