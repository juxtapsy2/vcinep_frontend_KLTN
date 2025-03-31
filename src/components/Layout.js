import React from "react";
import Header from "./Common/Header/Header.js";
import Footer from "./Common/Footer/Footer.js";
import ChatBot from "./chatbot/ChatBot.js";
import Messenger from "./Common/Chat/Messenger.js";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow" style={{ paddingTop: "4.6rem" }}>
        <ChatBot />
        <Messenger />
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
