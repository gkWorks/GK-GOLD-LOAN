import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JewelMaster = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [itemToRemove, setItemToRemove] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');
  console.log('Token being sent:', token); // Debug token

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching items...');
        const response = await axios.get('http://localhost:5000/jewel-master', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Jewel master items response:', response.data);
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          setError('Failed to fetch items: invalid data format');
        }
      } catch (error) {
        console.error('Error fetching jewel items:', error);
        setError('Failed to fetch jewel items: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchItems();
  }, [token]);

  const handleAddItem = async () => {
    const trimmedNewItem = newItem.trim();
  
    if (trimmedNewItem) {
      const normalizedItems = items.map(item => item.itemName.toLowerCase());
      const normalizedNewItem = trimmedNewItem.toLowerCase();
  
      if (normalizedItems.includes(normalizedNewItem)) {
        alert('Item already exists in the list!');
      } else {
        try {
          const response = await axios.post('http://localhost:5000/jewel-master', 
          { itemName: trimmedNewItem }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setItems([...items, response.data]);
          setNewItem('');
        } catch (error) {
          console.error('Error adding jewel item:', error);
          setError('Failed to add jewel item: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };
  

  const handleRemoveItem = async () => {
    if (confirmInput.trim().toLowerCase() === itemToRemove.itemName.toLowerCase()) {
      try {
        await axios.delete(`http://localhost:5000/jewel-master/${itemToRemove._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setItems(items.filter(item => item._id !== itemToRemove._id));
        setItemToRemove(null);
        setConfirmInput('');
      } catch (error) {
        console.error('Error deleting jewel item:', error);
        setError('Failed to delete jewel item: ' + (error.response?.data?.message || error.message));
      }
    } else {
      alert('Entered name does not match!');
    }
  };

  const requestRemoveItem = (item) => {
    setItemToRemove(item);
    setConfirmInput('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Jewel Master</h2>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="list-disc pl-5 mb-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item._id} className="mb-1 flex justify-between items-center">
              {item.itemName}
              <button
                onClick={() => requestRemoveItem(item)}
                className="ml-2 text-red-500 hover:text-red-700 text-2xl"
                title="Remove Item"
              >
                &times;
              </button>
            </li>
          ))
        ) : (
          <p>No items found</p>
        )}
      </ul>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add new item"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {itemToRemove && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
          <p className="text-sm mb-2">
            Type the name of the item <span className="font-bold">{itemToRemove.itemName}</span> to confirm removal:
          </p>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type the name to confirm"
          />
          <button
            onClick={handleRemoveItem}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Confirm Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default JewelMaster;