import React from 'react';
import { RiRobot2Line } from "react-icons/ri";
import OpenSideBar from "./OpenSideBar";

const Header = ({ setIsSideBarVisible, isSideBarVisible }) => {
  const handleSideBarToggle = () => {
    setIsSideBarVisible(prev => !prev); // Toggle between true and false
  };

  return (
    <header className="flex items-center justify-center p-2 bg-gray-700 text-white shadow-md border-b border-gray-800 pr-8">
      <OpenSideBar clicked={handleSideBarToggle} />
      <div className="flex items-center gap-2 mx-auto">
        <RiRobot2Line className="h-8 w-8 rounded-full text-blue-300" />
        <span className="text-xl font-semibold"> ChatBot AI </span>
      </div>
    </header>
  );
};

export default Header;
