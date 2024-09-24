import React, { useState } from 'react';

const JewelMaster = () => {
  const [items, setItems] = useState(['Chain', 'Bracelet']);
  const [newItem, setNewItem] = useState('');
  const [itemToRemove, setItemToRemove] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');

  const handleAddItem = () => {
    const trimmedNewItem = newItem.trim();

    if (trimmedNewItem) {
      const normalizedItems = items.map(item => item.toLowerCase());
      const normalizedNewItem = trimmedNewItem.toLowerCase();

      if (normalizedItems.includes(normalizedNewItem)) {
        alert('Item already exists in the list!');
      } else {
        setItems([...items, trimmedNewItem]);
        setNewItem('');
      }
    }
  };

  const handleRemoveItem = () => {
    if (confirmInput.trim().toLowerCase() === itemToRemove.toLowerCase()) {
      const updatedItems = items.filter(item => item !== itemToRemove);
      setItems(updatedItems);
      setItemToRemove(null);
      setConfirmInput('');
    } else {
      alert('Entered name does not match!');
    }
  };

  const requestRemoveItem = (item) => {
    setItemToRemove(item);
    setConfirmInput('');
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Jewel Master</h2>

      <ul className="list-disc pl-5 mb-4">
        {items.map((item, index) => (
          <li key={index} className="mb-1 flex justify-between items-center">
            {item}
            <button
              onClick={() => requestRemoveItem(item)}
              className="ml-2 text-red-500 hover:text-red-700 text-2xl"
              title="Remove Item"
            >
              &times;
            </button>
          </li>
        ))}
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
            Type the name of the item <span className="font-bold">{itemToRemove}</span> to confirm removal:
          </p>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={`Type "${itemToRemove}"`}
          />
          <button
            onClick={handleRemoveItem}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Confirm Remove
          </button>
          <button
            onClick={() => setItemToRemove(null)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default JewelMaster;
