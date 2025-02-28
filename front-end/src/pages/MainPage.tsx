import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import { fetchProtectedData, fetchOptimizedPrompt } from "../api/Api";
import PrompteerLogo from '../Prompteer-Logo.png';
import { ArrowUp } from 'lucide-react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

const ChatInput = ({ onSend, isLoading, hasMessages }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className={`chat-input-container ${isLoading ? 'bot-typing' : ''} ${hasMessages ? 'has-messages' : 'no-messages'}`}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a rough idea, and I'll refine it into the perfect AI prompt..."
          className="chat-input-textarea"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`chat-submit-button ${!input.trim() || isLoading ? 'disabled' : ''}`}
          disabled={!input.trim() || isLoading}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </form>
  );
};

const TypingIndicator = () => (
  <div className="chat-message bot typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const MainPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleProtectedData = async () => {
      try {
        const response = await fetchProtectedData();
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };

    handleProtectedData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    setMessages((prev) => [...prev, { text: inputText, sender: "user" }]);
    setIsLoading(true);

    try {
      const optimizedPrompt = await fetchOptimizedPrompt(inputText);
      setMessages((prev) => [...prev, { text: optimizedPrompt, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching optimized prompt:", error);
      setMessages((prev) => [...prev, { 
        text: "Sorry, I couldn't generate a response. Please try again.", 
        sender: "bot" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src={PrompteerLogo} alt="Prompteer Logo" />
        <h1>Good Evening, {user?.first_name || "Guest"}</h1>
      </header>

      <div className={`chat-box ${hasMessages ? 'has-messages' : 'no-messages'}`}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      <ChatInput 
        onSend={handleSendMessage} 
        isLoading={isLoading} 
        hasMessages={hasMessages} 
      />
    </div>
  );
};

export default MainPage;