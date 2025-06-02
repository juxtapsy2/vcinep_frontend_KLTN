import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { backendURL } from "../../constants/constants";

export default function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Xin chào, tôi là chatbot hỗ trợ, có thể giải đáp thắc mắc của bạn ngắn gọn trong 300 chữ!",
    },
  ]);
  const CHATBOT_ENDPOINT = backendURL;
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatBoxRef = useRef(null);
  const chatButtonRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target) &&
        chatButtonRef.current &&
        !chatButtonRef.current.contains(event.target)
      ) {
        setIsChatVisible(false);
      }
    };

    if (isChatVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isChatVisible]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsLoading(true);
    setUserInput("");

    try {
      const response = await axios.post(
        `${CHATBOT_ENDPOINT}/api/gemini/generate`,
        { prompt: userInput },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error with the API request:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatMessage = (content) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold mb-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-4 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-4 mb-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 mb-2">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 rounded px-1">{children}</code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };
  return (
    <div className="fixed bottom-24 right-6 z-[9999]">
      <button
        ref={chatButtonRef}
        className="relative group"
        onClick={() => setIsChatVisible(!isChatVisible)}
      >
        <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-red-500 via-red-400 to-pink-500 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
            <svg
              className="w-6 h-6"
              style={{ color: "#ff4b6e" }}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-red-400 to-pink-500 animate-pulse opacity-75 -z-10"></div>
      </button>

      {isChatVisible && (
        <div
          ref={chatBoxRef}
          className="absolute bottom-24 right-0 w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-red-500 via-red-400 to-pink-500 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                <svg
                  className="w-5 h-5"
                  style={{ color: "#ff4b6e" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">ChatBot</h1>
            </div>
            <button
              className="text-white hover:text-gray-200 text-xl font-bold transition-colors"
              onClick={() => setIsChatVisible(false)}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-red-500 via-red-400 to-pink-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="text-sm break-words">
                    {formatMessage(message.content)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="p-4 border-t bg-gray-50 rounded-b-2xl"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Nhập tin nhắn ở đây..."
                className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-3 bg-gradient-to-r from-red-500 via-red-400 to-pink-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Gửi"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
