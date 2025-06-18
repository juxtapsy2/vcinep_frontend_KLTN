import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from "../../../contexts/AuthContext";
import { backendURL, userRoles } from "../../../constants/constants";

const socket = io(backendURL);

const Messenger = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatRoom, setChatRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [hasUnreadMessages, setUnreadMessages] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Employee join chat
    if (user?.role === userRoles.EMPLOYEE) {
      socket.emit("join-chat", userRoles.EMPLOYEE);
    }
  
    // For User
    if (user?.role === userRoles.USER) {
      let storedRoomId = localStorage.getItem("user_room_id");
      if (!storedRoomId) {
        storedRoomId = `user-${socket.id}`;
        localStorage.setItem("user_room_id", storedRoomId);
      }
      setChatRoom(storedRoomId);
      socket.emit("join-chat", storedRoomId);
      const storedMessages = JSON.parse(localStorage.getItem(`chat_${storedRoomId}`)) || [];
      setMessages(storedMessages);
    }
  
    // For Guest
    let storedRoomId = localStorage.getItem("guest_room_id");
    if (!user?.role) {
      if (!storedRoomId) {
        storedRoomId = `guest-${socket.id}`;
        localStorage.setItem("guest_room_id", storedRoomId);
      }
      setChatRoom(storedRoomId);
      socket.emit("join-chat", storedRoomId);
      const storedMessages = JSON.parse(localStorage.getItem(`chat_${storedRoomId}`)) || [];
      setMessages(storedMessages);
    }
  
    // Listen for available rooms for employees
    socket.on("room-list", setAvailableRooms);

    // Handle unread message counts
    socket.on("unread-messages", (counts) => {
      setUnreadCounts(counts);
      // Set hasUnreadMessages based on the unread counts for all rooms
      setUnreadMessages(Object.values(counts).some(count => count > 0));
    });

    // When the chatRoom is selected, load its messages
    if (chatRoom) {
      socket.emit("join-chat", chatRoom);
      socket.on("loadMessages", (oldMessages) => {
        localStorage.setItem(`chat_${chatRoom}`, JSON.stringify(oldMessages));
        setMessages(oldMessages);
        setUnreadCounts((prev) => ({ ...prev, [chatRoom]: 0 }));
      });
    }
  
    // Handle receiving a new message
    socket.on("receiveMessage", (message) => {
      if (message.room === chatRoom) {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.sender !== (user?.role) && message.room !== chatRoom) {
        // Increase unread count for the User when they are not in the room
        setUnreadCounts((prev) => ({
          ...prev,
          [message.room]: (prev[message.room] || 0) + 1,
        }));
      }

       // Set unread messages state for User when a new message comes from the Employee
       if (message.sender === userRoles.EMPLOYEE && message.room !== chatRoom) {
        setUnreadMessages(true);
      }

      // Scroll to the newest message
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("room-list");
      socket.off("unread-messages");
      socket.off("loadMessages");
      socket.off("receiveMessage");
    };
  }, [chatRoom, user?.role]);

  const handleSendMessage = () => {
    if (inputValue.trim() && chatRoom) {
      const newMessage = { 
        text: inputValue, 
        sender: user ? user.role : userRoles.GUEST, 
        timestamp: Date.now() 
      };
      socket.emit('sendMessage', { room: chatRoom, message: newMessage });
      setInputValue('');
      setUnreadCounts(prev => ({ ...prev, [chatRoom]: 0 }));

      // Scroll to the newest message
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && chatRoom) {
      // Reset unread count for the room when chat is toggled open
      setUnreadCounts((prev) => ({ ...prev, [chatRoom]: 0 }));
      setUnreadMessages(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-6 z-[99999]">
      <button onClick={handleToggleChat} className="relative bg-gradient-to-br from-transparent via-gray-50 to-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-3 rounded-full">
        <img src="/resources/iconMessenger.svg" alt="Messenger" className="w-10 h-10" />
        {hasUnreadMessages && <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>}
      </button>

      {isOpen && (
        <div className="flex font-inter">
          {/* Phòng chờ (của nhân viên) */}
          {user?.role === userRoles.EMPLOYEE && (
            <div className="bg-white w-56 h-82 shadow-lg border border-red-200 rounded-lg p-4 mt-2 mr-4 overflow-hidden">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Phòng chờ</h3>
              <div className="max-h-80 overflow-y-auto pr-2">
                {availableRooms.map((room, index) => {
                  const shortRoomId = room.replace('guest-', '').slice(-3);
                  return (
                    <button key={index} className={`block w-full p-3 rounded-lg mb-2 transition-all ${chatRoom === room ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => setChatRoom(room)}>
                      <div className="flex justify-between items-center">
                        <span>Room-{shortRoomId}</span>
                        {unreadCounts[room] > 0 && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{unreadCounts[room]}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat box */}
          <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col mt-2 border border-red-200">
            <div className="bg-red-600 text-white p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold">{user?.role === userRoles.EMPLOYEE ? "Trò chuyện với khách hàng" : "Trò chuyện với chúng tôi"}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.sender === (user?.role || userRoles.GUEST) ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg text-left ${message.sender === (user?.role || userRoles.GUEST) ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{message.text}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-red-200">
              <div className="flex">
                <input type="text" autoComplete="off" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Nhập tin nhắn..." className="flex-1 p-2 border border-red-300 rounded-lg max-w-[75%]" />
                <button onClick={handleSendMessage} className="bg-red-600 text-white px-4 py-2 ml-auto rounded-lg"> Gửi </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;