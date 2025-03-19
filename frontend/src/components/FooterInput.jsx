import React, { useState, useRef, useEffect } from 'react';
import { RiSendPlane2Line } from "react-icons/ri";
import axios from 'axios';

const FooterInput = ({ onSendMessage, conversationId }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    onSendMessage(inputValue, 'User');
    setInputValue(''); // Clear input immediately
    resetTextareaHeight(); // Reset height immediately

    try {
      const response = await axios.post('http://localhost:8000/api/chatbot/', {
        message: inputValue,
        conversation_id: conversationId,
      });
      const botResponse = response.data.response;
      onSendMessage(botResponse, 'Bot');
    } catch (error) {
      console.error('Error sending message:', error);
      onSendMessage('Sorry, something went wrong.', 'Bot');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setIsExpanded(textarea.scrollHeight > 40);
    }
  };

  const resetTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '2.5rem';
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-700 text-white border-t border-gray-600">
      <div className="flex items-center gap-2 max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          className={`flex-1 p-2 bg-gray-800 text-white border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isExpanded ? 'overflow-y-auto' : 'overflow-y-hidden'
          }`}
          style={{ minHeight: '2.5rem', maxHeight: '10rem' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows="1"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
        >
          <RiSendPlane2Line className="h-5 w-5" />
          Send
        </button>
      </div>
    </div>
  );
};

export default FooterInput;
