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
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a rough idea, and I'll refine it into the perfect AI prompt..."
          className="chat-input-textarea"
          rows={1}
        />
        <button
          type="submit"
          className={`chat-submit-button ${!input.trim() ? 'disabled' : ''}`}
          disabled={!input.trim()}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </form>
  );
};

const MainPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [user, setUser] = useState<User | null>(null);

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
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { text: inputText, sender: "user" }]);

    try {
      const optimizedPrompt = await fetchOptimizedPrompt(inputText);
      setMessages((prev) => [...prev, { text: optimizedPrompt, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching optimized prompt:", error);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src={PrompteerLogo} alt="Prompteer Logo" />
        <h1>Good Evening, {user?.first_name || "Guest"}</h1>
      </header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default MainPage;