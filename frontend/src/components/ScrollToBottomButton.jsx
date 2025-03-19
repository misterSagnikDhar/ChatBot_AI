import React from 'react';
import { FaArrowDown } from 'react-icons/fa'; // Using a downward arrow icon

const ScrollToBottomButton = ({ onClick, isVisible }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed right-4 bottom-1/4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <FaArrowDown className="h-5 w-5" />
    </button>
  );
};

export default ScrollToBottomButton;
