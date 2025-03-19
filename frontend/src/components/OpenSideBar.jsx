import React from 'react';
import {CgMenuRightAlt} from "react-icons/cg";

const OpenSideBar = ({clicked}) => {
  return (
    <button
        onClick={clicked}
        className="text-white hover:text-blue-300"
    >
      <CgMenuRightAlt size={24}/>
    </button>
  );
};

export default OpenSideBar;
