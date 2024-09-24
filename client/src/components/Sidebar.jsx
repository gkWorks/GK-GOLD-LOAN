import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUser, FaMoneyBill, FaSignOutAlt } from 'react-icons/fa';
import Smartlogo from '../assets/smartFinance.png';

const Sidebar = () => {

  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <aside className="w-64 h-screen bg-blue-900 text-gray-100 p-6 py-10">
      {/* Center and reduce logo size */}
      <div className="flex justify-center mb-4">
        <img src={Smartlogo} alt="Smart Finance Logo" className="w-24 h-auto" />
      </div>

      <h2 className="text-center text-2xl font-bold mb-8">Smart Finance</h2>

      <hr className="border-gray-700 mb-8" />

      <ul className="space-y-4">
        <li>
          <NavLink
            to="/dashboard"
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
        <li>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
            }
          >
            <FaUser className="mr-3 text-xl" />
            <span className="text-lg font-semibold">Customers</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/gold-loan"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-300 ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
            }
          >
            <FaMoneyBill className="mr-3 text-xl" />
            <span className="text-lg font-semibold">Gold Loan</span>
          </NavLink>
        </li>
        {/* Logout Button */}
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-cyan-500 transition-colors duration-300"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="inline-block mr-2" />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
