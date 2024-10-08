import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoldLoanMaster = () => {
  const [formData, setFormData] = useState({
    loanName: '',
    interestRate: '',
    maxDays: '',
    interestslabs: [],
    slabImplementationDate: [],
    daysOption: 'Custom'
  });
  const [loanNames, setLoanNames] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false); // Popup for date selection
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [interestPercentage, setInterestPercentage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slabImplementationDates, setSlabImplementationDates] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null); // To track selected loan ID for update
  const [selectedSlabs, setSelectedSlabs] = useState([]); // State to store selected slabs
  const [editingSlabIndex, setEditingSlabIndex] = useState(null); // New state to track editing slab index
  const token = localStorage.getItem('authToken');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 // Handle double-click on slab to edit
 const handleSlabDoubleClick = (index) => {
  const slab = selectedSlabs[index];
  setFromDate(slab.from);
  setToDate(slab.to);
  setInterestPercentage(slab.interestRate);
  setEditingSlabIndex(index); // Set the index to know which slab is being edited
  setShowPopup(true); // Open the popup for editing
};

const handleLongClick = (index) => {
  const confirmRemove = window.confirm('Are you sure you want to remove this slab?');
  if (confirmRemove) {
    handleSlabRemove(index);
  }
};

  // Handle updating the slab
  const handleSlabUpdate = () => {
    if (editingSlabIndex !== null) {
      // Check if a slab is being edited
      const updatedSlabs = [...selectedSlabs];
      updatedSlabs[editingSlabIndex] = {
        from: fromDate,
        to: toDate,
        interestRate: interestPercentage,
        slabImplementationDate: selectedDate
      };

      setFormData((prevData) => ({
        ...prevData,
        interestslabs: updatedSlabs
      }));

      // Reset form and state
      setFromDate('');
      setToDate('');
      setInterestPercentage('');
      setEditingSlabIndex(null);
    }
  };
  const handleSlabRemove = async (index) => {
    if (index === null) {
      alert('No slab selected for removal.');
      return;
    }
  
    const response = await fetch('http://localhost:5000/api/gold-loans/slabs/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        loanName: formData.loanName,
        slabIndex: index, // Send the index of the slab to be removed
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
      return;
    }
  
    const data = await response.json();
    console.log('Success:', data);
  
    // Update the local state to reflect the removed slab
    const updatedSlabs = selectedSlabs.filter((_, idx) => idx !== index);
    setSelectedSlabs(updatedSlabs); // Update the selected slabs state
  
    // Update the formData as well if needed
    setFormData(prevData => ({
      ...prevData,
      interestslabs: prevData.interestslabs.filter((_, idx) => idx !== index)
    }));
  
    alert('Slab removed successfully');
  
    // Reset the editing index if we are removing the currently editing slab
    if (editingSlabIndex === index) {
      setEditingSlabIndex(null); 
    }
    // Reset form and state
    setFromDate('');
    setToDate('');
    setInterestPercentage('');
    setEditingSlabIndex(null);
  };


  // Open the popup
  const handleButtonClick = () => {
    setShowPopup(true);
  };
// Handle adding a new slab
const handleSlabAdd = () => {
  const newSlab = {
    slabImplementationDate: selectedDate,
    from: fromDate,
    to: toDate,
    interestRate: interestPercentage
  };
  
  setFormData((prevData) => ({
    ...prevData,
    interestslabs: [...prevData.interestslabs, newSlab],
    slabImplementationDate: [...prevData.slabImplementationDate, selectedDate]
  }));

  setFromDate('');
  setToDate('');
  setInterestPercentage('');
};
// Handle adding a new date from popup
const handleDateAdd = () => {
  if (!selectedDate) {
    alert('Please select a date.');
    return;
  }

  if (slabImplementationDates.includes(selectedDate)) {
    alert('This date is already added.');
    return;
  }

  setSlabImplementationDates([...slabImplementationDates, selectedDate]); // Add the selected date to the array
  setShowDatePopup(false); // Close date popup
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const apiUrl = selectedLoanId 
    ? `http://localhost:5000/api/gold-loans/${selectedLoanId}` 
    : 'http://localhost:5000/api/gold-loans';

  const method = selectedLoanId ? 'PUT' : 'POST';

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    const data = await response.json();
    console.log('Success:', data);

    // Reset form after successful submission
    setFormData({
      loanName: '',
      slabImplementationDate: [],
      interestRate: '',
      maxDays: '',
      interestslabs: [],
      daysOption: 'Custom'
    });
    setShowPopup(false); 
    setSelectedLoanId(null); 
    setSlabImplementationDates([]);
    setSelectedSlabs([]);
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error submitting the form. Please try again.');
  }
};
 // Fetch loan names on component load
 useEffect(() => {
  const fetchLoanNames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gold-loans/names', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoanNames(response.data.map((loan) => ({ id: loan._id, loanName: loan.loanName })));
    } catch (error) {
      console.error('Error fetching loan names:', error);
      alert('There was an error fetching loan names.');
    }
  };
  fetchLoanNames();
}, [token]);

 // Handle loan name click to fetch details and populate form
 const handleLoanClick = async (loanId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/gold-loans/${loanId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const loanData = response.data;
    setSelectedLoanId(loanId);
    setFormData({
      loanName: loanData.loanName,
      slabImplementationDate: loanData.slabImplementationDate,
      interestRate: loanData.interestRate || '',
      maxDays: loanData.maxDays || '',
      interestslabs: loanData.interestslabs || [],
      daysOption: 'Custom'
    });
    setSlabImplementationDates(loanData.slabImplementationDate || []);
    setSelectedSlabs([]); // Reset selected slabs on loan change
  } catch (error) {
    console.error('Error fetching loan details:', error);
    alert('There was an error fetching loan details.');
  }
};
  // Function to display slabs for the selected date
  const handleShowSlabs = () => {
    if (selectedDate) {
      // Ensure that interestslabs is defined and is an array before filtering
      const matchedSlabs = Array.isArray(formData.interestslabs)
        ? formData.interestslabs.filter(slab => slab.slabImplementationDate === selectedDate)
        : []; // Fallback to an empty array if undefined
      setSelectedSlabs(matchedSlabs); // Update the selected slabs state
    } else {
      setSelectedSlabs([]); // Clear if no date is selected
    }
  };

  return (
    <div className="max-w-10xl mx-auto mt-5">
      <h1 className="text-3xl font-bold text-center mb-5">Gold Loan Master</h1>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Left Section */}
        <div className="bg-gray-100 p-8 rounded-md shadow-md pt-20 w-full">
          <h1 className="font-bold pb-5">Loan Names</h1>
          <div className="grid grid-cols-1 gap-4">
            {loanNames.map((loan) => (
              <div
                key={loan.id}
                className="bg-white p-4 border rounded-md shadow-sm cursor-pointer"
                onClick={() => handleLoanClick(loan.id)}
              >
                {loan.loanName}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white shadow-md rounded-lg p-10">
          <form onSubmit={handleSubmit}>
            {/* Loan Name Input */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loanName">
                  Loan Name
                </label>
                <input
                  id="loanName"
                  name="loanName"
                  type="text"
                  value={formData.loanName}
                  onChange={handleChange}
                  className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700 bg-gray-100"
                  placeholder="Enter Loan Name"
                />
              </div>
              <div className="pl-60 flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxDays">
                  Max Days
                </label>
                <input
                  id="maxDays"
                  name="maxDays"
                  type="number"
                  value={formData.maxDays}
                  onChange={handleChange}
                  className="shadow appearance-none border border-gray-300 rounded w-40 py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  placeholder="MaxDays"
                  style={{ maxWidth: '100px' }}
                />
              </div>
            </div>

            {/* Interest Rate Input */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-center">
                <div className="w-full">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interestRate">
                    Interest Rate (%)
                  </label>
                  <input
                    id="interestRate"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleChange}
                    className="shadow border border-gray-300 rounded w-72 py-1 px-3 text-gray-700 bg-gray-100"
                    placeholder="Enter Interest Rate"
                  />
                </div>
                <div className="pr-20 pt-6">
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 ml-3"
                  >
                    ...
                  </button>
                </div>
              </div>
            </div>
          
          {/* Popup for Adding Interest Slab */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-5 w-4/5 md:w-1/2 flex flex-col">
                <h1 className="text-2xl font-bold text-center mb-5">Interest Fixing for Gold Loan</h1>

                {/* Flex container for the input sections */}
                <div className="flex space-x-4 mb-5">
                  {/* Left Side: Date Input and Added Interest Slabs */}
                  <div className="flex-1 flex flex-col space-y-4">
                    {/* Date Input with ">>" Button and "Add" Button */}
                    <div className="flex items-center space-x-2">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slabImplementationDate">
                          Slab Implementation Date
                        </label>
                        <select
                          id="slabImplementationDate"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="border border-gray-300 rounded w-full py-2 px-3"
                        >
                          <option value="">Select a date</option>
                          {Array.from(new Set(slabImplementationDates)).map((date, index) => (
                            <option key={index} value={date}>
                              {date}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='pt-5 space-x-3'>
                      <button
                      className="bg-gray-300 text-gray-700 py-2 px-3 rounded hover:bg-gray-400 mt-2"
                      type="button"
                      onClick={handleShowSlabs} // Call the show slabs function on click
                      >
                            &gt;&gt;
                    </button>
                      
                   {/* "Add" Button for Date */}
                    <button
                      className="bg-neutral-600 text-white py-2 px-2 rounded hover:bg-neutral-700"
                      type='button'
                      onClick={() => setShowDatePopup(true)}  // Trigger the new popup
                    >
                      Add date
                    </button>
                  </div>
                  </div>
                  <div className=''>
                  {/* Right Side: Interest Slabs */}
                  <div className="mt-5 pt-5">
                    <h3 className="text-xl font-bold mb-3">
                      Interest Slabs for {selectedDate || 'the selected date'}
                    </h3>

              
                    {selectedSlabs.length > 0 ? (
                    <div>
                      <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">From</th>
                            <th className="py-2 px-4 border">To</th>
                            <th className="py-2 px-4 border">Interest Rate (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSlabs.map((slab, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-100 cursor-pointer"
                              onDoubleClick={() => handleSlabDoubleClick(index)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                handleLongClick(index);
                              }}
                            >
                              <td className="py-2 px-4 border">{slab.from}</td>
                              <td className="py-2 px-4 border">{slab.to}</td>
                              <td className="py-2 px-4 border">{slab.interestRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Disclaimer message */}
                      <div className="disclaimer-container mt-4">
                        <p className="disclaimer-text">
                        DoubleClick update slabs,Longpress(mouse Rightclick)delete.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No slabs added yet.</p>
                  )}
                  </div>
                  </div>
                  </div>

                  {showDatePopup && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-5 w-1/3 flex flex-col">
                          <h2 className="text-xl font-bold text-center mb-5">Select Date of Implementation</h2>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                            className="shadow border border-gray-300 rounded w-1/2 py-2 px-3 text-gray-700 bg-gray-100 mx-auto mb-5"
                          />
                          <div className="flex justify-center space-x-4">
                            <button
                              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                              onClick={handleDateAdd}
                            >
                              Add
                            </button>
                            <button
                              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                              onClick={() => setShowDatePopup(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                
                   
                  {/* Right Side: Interest Slab Input */}
                  <div className="flex-1 flex flex-col space-y-4 pt-20">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fromDate">
                        From
                      </label>
                      <input
                        id="fromDate"
                        name="fromDate"
                        type="number"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toDate">
                        To
                      </label>
                      <input
                        id="toDate"
                        name="toDate"
                        type="number"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700 bg-gray-100"
                      />
                    </div>
                    <label className="text-gray-700 text-sm font-bold mr-2" htmlFor="interestPercentage">
                      Interest Percentage (%)
                    </label>
                    <div className="flex items-center space-x-3">
                    <input
                      id="interestPercentage"
                      name="interestPercentage"
                      type="number"
                      value={interestPercentage}
                      onChange={(e) => setInterestPercentage(e.target.value)}
                      className="shadow border border-gray-300 rounded w-56 py-1 px-3 text-gray-700 bg-gray-100"
                    />
                    <button
                      type="button"
                      className="bg-neutral-600 text-white rounded px-3 py-2 hover:bg-neutral-700"
                    >
                      sub-slab
                    </button>
                  </div>
                  </div>
                </div>

                <div className="flex justify-end pr-64 pt-5 space-x-4">
                
                  <button
                    type="button"
                    onClick={handleSlabUpdate}
                    className="bg-blue-500 text-white w-28 rounded px-3 py-2"
                  >
                    update
                  </button>
                  <button
                    type="button"
                    onClick={handleSlabAdd}
                    className="bg-green-500 text-white rounded px-3 py-2"
                  >
                    Add
                  </button>
                </div>
                <div className='flex justify-end pr-80 pt-6'>
                 <input type='checkbox'/><span className='font-serif'>slab system</span>
                </div>
                <div className='flex justify-end space-x-4 pt-10'>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-red-500 text-white w-28 rounded px-3 py-2"
                >
                  Close
                </button>
                <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-blue-500 text-white w-28 rounded px-3 py-2"
                  >
                    save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoldLoanMaster;
 