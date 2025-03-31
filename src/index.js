import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Xóa tin nhắn cũ sau 10 phút
const MAX_STORAGE_TIME = 10 * 60 * 1000; // 10 phút (milliseconds)

function cleanupOldMessages() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("chat_")) {
      const messages = JSON.parse(localStorage.getItem(key));
      if (messages && messages.length > 0) {
        const lastMessageTime = messages[messages.length - 1].timestamp;
        if (Date.now() - lastMessageTime > MAX_STORAGE_TIME) {
          localStorage.removeItem(key);
        }
      }
    }
  });
}
// Chạy mỗi khi người dùng mở lại trang
cleanupOldMessages();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
