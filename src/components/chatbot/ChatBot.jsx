import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../../constants/constants';

export default function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: "Xin chào, tôi là chatbot hỗ trợ, có thể giải đáp thắc mắc của bạn ngắn gọn trong 300 chữ!" }
  ]);
  const CHATBOT_ENDPOINT = backendURL; // Endpoint phía backend

  //Các thông số giao diện
  const [isLoading, setIsLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatBoxPosition, setChatBoxPosition] = useState( {top: 0, left: 0});
  const [chatBoxHeight, setChatBoxHeight] = useState(0);
  const chatBoxRef = useRef(null);
  const chatButtonRef = useRef(null);
  const CHATBOX_MAX_TOP = 50; // Top margin khi chatbox grow hết cỡ

  // Đóng chatbox khi click ra ngoài
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
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isChatVisible]);
  // Resize chatbox khi độ dài hội thoại tăng
  const resizeChatBox = () => {
    if (!chatBoxRef.current) return;

    const chatContentHeight = chatBoxRef.current.scrollHeight;
    const iconBottom = chatButtonRef.current.getBoundingClientRect().top + 50;

    if (iconBottom - chatContentHeight > CHATBOX_MAX_TOP) {
      // Grow upwards until the top boundary is reached
      setChatBoxHeight(chatContentHeight);
    } else {
      // Fix the top and allow growth downward
      setChatBoxHeight(iconBottom - CHATBOX_MAX_TOP);
    }
  };
  useEffect(() => {
    if (chatButtonRef.current) {
      const rect = chatButtonRef.current.getBoundingClientRect();
      setChatBoxPosition({
        top: rect.top - chatBoxHeight, // Điều chỉnh y theo chatbot icon
        left: rect.left - 325, // Điều chỉnh x theo chatbot icon
      });
    }
  }, [isChatVisible, chatBoxHeight]);

  useEffect(() => {
    if (isChatVisible) {
      resizeChatBox();
      window.addEventListener('resize', resizeChatBox);
    } else {
      setChatBoxHeight(0); // Reset height when chatbox is closed
      window.removeEventListener('resize', resizeChatBox);
    }

    return () => {
      window.removeEventListener('resize', resizeChatBox);
    };
  }, [messages, isChatVisible]);
  // Hàm gửi message đến bot ở backend
  const sendMessage = async (event) => {
    event.preventDefault(); // Ngăn trang reload

    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userInput }
    ]);

    setIsLoading(true);
    setUserInput(''); // Clear input field

    try {
      // Gửi request đến backend endpoint
      const response = await axios.post(
        `${CHATBOT_ENDPOINT}/chat`, 
        {
          message: userInput 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Append assistant's response to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: response.data.response },
      ]);
    } catch (error) {
      console.error('Error with the API request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative align-middle top-[512px] z-[9999]">
      {/* Chatbot icon */}
       <img ref={chatButtonRef} 
            width="50" height="50" src="https://img.icons8.com/ios-filled/ef4444/50/message-bot.png" alt="message-bot"
            className="fixed align-middle right-4 hover:cursor-pointer hover:filter hover:brightness-90"
            onClick={() => {
              setIsChatVisible(!isChatVisible);
              console.log('ChatBot visibility:', !isChatVisible); // Check state
            }}
        />

      {/* Khung chat */}
      {isChatVisible && (
        <div
          ref={chatBoxRef}
          className="fixed p-4 bg-white shadow-2xl rounded-lg w-80 max-w-full max-h-[100vh] overflow-auto"
          style={{
            top: chatBoxPosition.top + 'px',
            left: chatBoxPosition.left + 'px',
            transition: 'top 0.3s ease, left 0.3s ease', // Smooth transition
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">ChatBot</h1>
            <button
              className="text-red-700 font-inter"
              onClick={() => setIsChatVisible(false)}
            >
              X
            </button>
          </div>
          <div className="flow-root">
            <div className="mt-6">
              <form onSubmit={sendMessage}>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Nhập tin nhắn ở đây..."
                    className="flex-1 rounded-md shadow-sm p-2"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>

            <ul className="divide-y divide-gray-200">
              {messages.map((message, index) => (
                <li key={index} className="py-3 sm:py-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {message.role === 'assistant' && (
                        <img
                          className="w-8 h-8 rounded-full"
                          src="https://img.icons8.com/forma-regular-filled/ef4444/bot.png"
                          alt="Bot Avatar"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 break-normal whitespace-pre-line">
                        <span className="font-bold">{message.role === 'user' ? 'You: ' : 'Bot: '}</span>
                        {message.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}