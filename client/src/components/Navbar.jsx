import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCog, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 p-4 text-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">GK LOAN</h1>
        
        {/* Search Bar */}
        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 bg-blue-800 text-gray-100 rounded-lg focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
          </div>
        </div>
        
       
          {/* Settings Icon */}
          <FaCog className="text-2xl cursor-pointer hover:text-blue-300 transition duration-300" />
          {/* User Icon */}
          <FaUser className="text-2xl cursor-pointer hover:text-blue-300 transition duration-300" />
        </div>
      
    </nav>
  );
};

export default Navbar;
