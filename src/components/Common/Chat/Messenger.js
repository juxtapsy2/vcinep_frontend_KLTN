import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from "../../../contexts/AuthContext";

const socket = io('http://localhost:8800');

const ChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatRoom, setChatRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const messagesEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Guest join room
  useEffect(() => {
    if (!user?.role && chatRoom === null) {
      const roomId = `guest_${socket.id}`;
      setChatRoom(roomId);
      socket.emit("join-chat", roomId);
      console.log("Guest joined room:", roomId);
    }
  }, [user?.role, chatRoom]);

  // Set danh sách room và số lượng unread messages cho nhân viên
  useEffect(() => {
    socket.on("room-list", (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on("unread-messages", (counts) => {
      setUnreadCounts(counts);
    });

    return () => {
      socket.off("room-list");
      socket.off("unread-messages");
    };
  }, []);
  // Nhân viên switch room
  useEffect(() => {
    if (chatRoom) {
      socket.emit("join-chat", chatRoom);
      console.log("Joined room:", chatRoom);
      socket.on("loadMessages", (oldMessages) => {
        setMessages(oldMessages);
        setUnreadCounts((prev) => ({ ...prev, [chatRoom]: 0 }));
      });
    }
    return () => {
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, [chatRoom]);

  // Nhận tin nhắn mới
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [message.room]: (prev[message.room] || 0) + 1
      }));

      if (message.room === chatRoom) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setUnreadCounts((prev) => ({ ...prev, [chatRoom]: 0 }));
      }
    });
    return () => socket.off("receiveMessage");
  }, [chatRoom]);

  const handleSendMessage = () => {
    if (inputValue.trim() && chatRoom) {
      const newMessage = { text: inputValue, sender: user ? user.role : "Guest" };
      socket.emit('sendMessage', { room: chatRoom, message: newMessage });
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-4 right-6 z-[99999]">
      {/* Chatbox button */}
      <button onClick={() => setIsOpen(!isOpen)} className={`bg-red-500 text-white p-3 ${user?.role ? "m-3":""} rounded-full shadow-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {isOpen && (
        <div className="flex font-inter">
          {/* Room list (Employee) */}
          {user?.role === "Employee" && availableRooms.length > 0 && (
            <div className="bg-white w-56 h-96 shadow-lg border border-red-200 rounded-lg p-4 mr-4 overflow-hidden">
              <h3 className="text-lg font-semibold mb-3 text-red-500">Phòng chờ</h3>
              <div className="max-h-80 overflow-y-auto pr-2"> {/* Fix scrollbar issue */}
                {availableRooms.map((room, index) => {
                  const shortRoomId = room.replace('guest-', '').slice(-6);
                  return (
                    <button 
                      key={index} 
                      className={`block w-full p-3 rounded-lg mb-2 transition-all duration-300 ${chatRoom === room ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setChatRoom(room)}
                    >
                      <div className="flex justify-between items-center">
                        <span>#{shortRoomId}</span>
                        {unreadCounts[room] > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCounts[room]}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chatbox */}
          <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col mt-2 border border-red-200">
            <div className="bg-red-500 text-white p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold">{user?.role ? "Trò chuyện với khách hàng" : "Trò chuyện với chúng tôi"}</h2>
            </div>

            {/* Message */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.sender === (user?.role || "Guest") ? 'text-right' : 'text-left'}`}> 
                  <div className={`inline-block p-2 rounded-lg ${message.sender === (user?.role || "Guest") ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}> {message.text} </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Khung chat */}
            <div className="p-4 border-t border-red-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 p-2 border border-red-300 rounded-lg"
                />
                <button onClick={handleSendMessage} className="bg-red-500 text-white px-4 py-2 rounded-lg"> Gửi </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
