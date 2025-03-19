import React from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Using an upward arrow icon

const ScrollToTopButton = ({ onClick, isVisible }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed right-4 top-1/4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <FaArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;
