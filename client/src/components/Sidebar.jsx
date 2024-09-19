import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBox } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-gray-100 p-6 py-10">
      <h2 className="text-2xl font-bold mb-8">Sidebar</h2>

      <hr className="border-gray-700 mb-8" />

      <ul className="space-y-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
            }
          >
            <FaTachometerAlt className="mr-3 text-xl" />
            <span className="text-lg font-semibold">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/master"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
            }
          >
            <FaBox className="mr-3 text-xl" />
            <span className="text-lg font-semibold">Master</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
