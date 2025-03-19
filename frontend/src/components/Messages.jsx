import React, { forwardRef } from 'react';
import ChatBubbles from './ChatBubbles';

// Use forwardRef to pass the ref from App.js
const Messages = forwardRef(({ messages }, ref) => {
  return (
    <div ref={ref} className="flex-1 p-4 overflow-y-auto mb-20">
      {messages.map((msg, index) => (
        <ChatBubbles key={index} sender={msg.sender} text={msg.text} />
      ))}
    </div>
  );
});

export default Messages;
