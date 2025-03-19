import React, { useState, useEffect } from 'react';
import { HiPlus } from "react-icons/hi";
import "./SideBar.css";
import { RiRobot2Line } from "react-icons/ri";
import { IoChevronBack } from "react-icons/io5";
import axios from 'axios';

const SideBar = ({ conversationId, setConversationId, isVisible, setIsVisible, onChatDelete }) => {
  const [chatHistory, setChatHistory] = useState([
    { id: 'chat-1', name: 'Chat 1' }, // Default "Chat 1" with fixed ID
  ]);

  const handleHideSidebar = () => {
    setIsVisible(false);
  };

  const handleDeleteChat = (id) => {
    if (id === 'chat-1') return;
    setChatHistory(chatHistory.filter(chat => chat.id !== id));
    onChatDelete(id);
  };

  const handleNewChat = async () => {
    try {
      const response = await axios.post('https://chatbot-ai-gydp.onrender.com/api/new-chat/');
      const newConversationId = response.data.conversation_id;
      const newChat = { id: newConversationId, name: `Chat ${chatHistory.length + 1}` };
      setChatHistory([...chatHistory, newChat]);
      setConversationId(newConversationId);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-gray-700 text-white flex flex-col shadow-lg border-r border-black-600 z-50">
      <button
        onClick={handleHideSidebar}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white text-indigo-600 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-600 rounded-full p-2 shadow-lg border border-gray-300 flex items-center justify-center"
      >
        <IoChevronBack className="w-6 h-6" />
      </button>
      <div className="absolute pl-[4rem]">
        <RiRobot2Line className="h-20 w-20 rounded-full text-blue-300 " />
      </div>
      <div className="text-2xl font-bold text-white-500 pt-24">
        <button
          type="button"
          onClick={handleNewChat}
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2 shadow-lg flex gap-2 items-center ml-8 mt-4"
        >
          New Chat
          <HiPlus className="text-white text-lg font-bold" />
        </button>
      </div>
      <div className="text-xl font-bold text-white-500 mt-6 ml-9">
        <h1>Chat History</h1>
      </div>
      <div className="mt-4 ml-2 flex flex-col gap-2 overflow-y-auto flex-1 sidebar">
        {chatHistory.map(chat => (
          <button
            key={chat.id}
            onClick={() => setConversationId(chat.id)}
            className={`bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-4 py-2 shadow-md text-left flex items-center justify-between w-full ${
              conversationId === chat.id ? 'bg-indigo-600' : ''
            }`}
          >
            <span>{chat.name}</span>
            {chat.id !== 'chat-1' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                >
                  <path d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"/>
                </svg>
              </button>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
