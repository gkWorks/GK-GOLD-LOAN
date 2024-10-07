import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoldLoanMaster = () => {
  const [formData, setFormData] = useState({
    loanName: '',
    interestRate: '',
    maxDays: '',
    slabs: [],
    slabImplementationDate: [],
    interestType: [],
    daysOption: 'Custom'
  });
  const [loanNames, setLoanNames] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [interestPercentage, setInterestPercentage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          interestType: [...prevData.interestType, value]
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          interestType: prevData.interestType.filter((item) => item !== value)
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      slabs: [...prevData.slabs, newSlab],
      slabImplementationDate: [...prevData.slabImplementationDate, selectedDate]
    }));

    // Reset input fields
    setFromDate('');
    setToDate('');
    setInterestPercentage('');
    setSelectedDate('');
    setShowPopup(false); // Close the popup
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/gold-loans', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Success:', response.data);
      // Remove the navigation part to stay on the same page
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch loan names on component load
  useEffect(() => {
    const fetchLoanNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/gold-loans/names', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoanNames(response.data.map((loan) => loan.loanName));
      } catch (error) {
        console.error('Error fetching loan names:', error);
      }
    };
    fetchLoanNames();
  }, [token]);

  return (
    <div className="max-w-10xl mx-auto mt-5">
      <h1 className="text-3xl font-bold text-center mb-5">Gold Loan Master</h1>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Left Section */}
        <div className="bg-gray-100 p-8 rounded-md shadow-md pt-20 w-full">
          <h1 className="font-bold pb-5">Loan Names</h1>
          <div className="grid grid-cols-1 gap-4">
            {loanNames.map((loanName, index) => (
              <div key={index} className="bg-white p-4 border rounded-md shadow-sm">
                {loanName}
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
                  placeholder="Max Days"
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
                <div className="bg-white rounded-lg shadow-lg p-5 w-4/5 md:w-1/3">
                  <h1 className="text-2xl font-bold text-center mb-5">Interest Fixing for Gold Loan</h1>
                  <div className="flex flex-col space-y-4">
                    <label className="block text-gray-700 text-sm font-bold">Date of Implementation</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700"
                    />
                    <label className="block text-gray-700 text-sm font-bold">From</label>
                    <input
                      type="text"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700"
                    />
                    <label className="block text-gray-700 text-sm font-bold">To</label>
                    <input
                      type="text"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700"
                    />
                    <label className="block text-gray-700 text-sm font-bold">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={interestPercentage}
                      onChange={(e) => setInterestPercentage(e.target.value)}
                      className="shadow border border-gray-300 rounded w-full py-1 px-3 text-gray-700"
                    />
                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleSlabAdd}
                      >
                        Add Slab
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => setShowPopup(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Display Added Slabs */}
                  <div className="mt-5">
                    <h2 className="text-xl font-semibold mb-3">Added Interest Slabs</h2>
                    {formData.slabs.length > 0 ? (
                      formData.slabs.map((slab, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-3 border rounded-md mb-2 shadow-sm"
                        >
                          <p>Implementation Date: {slab.slabImplementationDate}</p>
                          <p>From: {slab.from}</p>
                          <p>To: {slab.to}</p>
                          <p>Interest Rate: {slab.interestRate}%</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No slabs added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
             <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-center">
              <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="goldRate">
                Gold Rate
              </label>
              <input
                id="goldRate"
                name="goldRate"
                type="number"
                value={formData.goldRate}
                onChange={handleChange}
                className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                placeholder="Enter Gold Rate"
              />
              
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="flex items-center">
              <div className="w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minWeight">
                Minimum Weight
              </label>
              <input
                id="minWeight"
                name="minWeight"
                type="number"
                value={formData.minWeight}
                onChange={handleChange}
                className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                placeholder="Enter Minimum Weight"
              />
              
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-5">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
              >
                Save & Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoldLoanMaster;
