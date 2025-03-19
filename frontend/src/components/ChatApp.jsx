import React, { useState } from 'react';
import Messages from './Messages';
import FooterInput from './FooterInput';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);

  // Handle user message submission
  const handleSendMessage = (messageText) => {
    if (messageText.trim() === "") return;
    setMessages([...messages, { sender: 'User', text: messageText }]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages display */}
      <Messages messages={messages} />
      {/* Message input */}
      <FooterInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatApp;
