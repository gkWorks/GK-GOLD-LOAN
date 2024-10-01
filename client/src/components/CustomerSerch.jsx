// src/components/Search.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerSerch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    aadhaarNo: '',
    mobileNo: ''
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const token = localStorage.getItem('authToken'); // Make sure you're sending token for authentication

  // Fetch customers based on search criteria
  const fetchFilteredCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers/CustomerSerch', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: searchCriteria // Pass the search criteria as query params
      });
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching filtered customers:', error);
    }
  };

  // Handle input change for search criteria
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  // Search button click handler
  const handleSearch = () => {
    fetchFilteredCustomers();
  };

  //Navigation Search customer
  const navigate = useNavigate();

  const handelCancel = () => {
    navigate('/customers');
  }
  
  const handleCustomerClick = (customer) => {
    navigate('/customers', { state: { customer } });
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Customers</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={searchCriteria.name}
          onChange={handleInputChange}
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="aadhaarNo"
          placeholder="Aadhaar No"
          value={searchCriteria.aadhaarNo}
          onChange={handleInputChange}
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="mobileNo"
          placeholder="Mobile No"
          value={searchCriteria.mobileNo}
          onChange={handleInputChange}
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
        <button
          onClick={handelCancel}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Back to Customers
        </button>
      </div>

      <table className="w-full table-auto border border-gray-300 cursor-pointer" >
        <thead>
          <tr >
            <th className="border px-2 py-1">Customer ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Father/Spouse</th>
            <th className="border px-2 py-1">Mobile No</th>
            <th className="border px-2 py-1">Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(customer => (
            <tr key={customer.customerId} onClick={() => handleCustomerClick(customer)}>
              <td className="border px-2 py-1">{customer.customerId}</td>
              <td className="border px-2 py-1">{customer.name}</td>
              <td className="border px-2 py-1">{customer.spouse}</td>
              <td className="border px-2 py-1">{customer.mobileNo}</td>
              <td className="border px-2 py-1">{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerSerch;
