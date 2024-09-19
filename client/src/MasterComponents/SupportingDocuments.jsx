import React, { useState } from 'react';

const SupportingDocuments = () => {
  const [documentName, setDocumentName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const handleInputChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleRegister = () => {
    if (documentName.trim()) {
      setDocuments([...documents, documentName]); // Store documents internally like an array
      setDocumentName(''); // Clear the input field
      setShowPopup(true); // Show popup on register
      setTimeout(() => setShowPopup(false), 2000); // Hide popup after 2 seconds
    }
  };

  const handleEdit = () => {
    // Implement your edit functionality here
    alert('Edit button clicked!');
  };

  return (
    <div className="flex flex-col h-screen p-6">
      {/* Header stays at the top */}
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6 pt-10">Document Name Master:</h1>
      </div>

      {/* Popup for registration */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Document Registered!
        </div>
      )}

      {/* Content is centered with space between them */}
      <div className="flex flex-1 flex-col justify-between items-center pb-40">
        <div className="space-y-10">
          {/* Registered documents section */}
          <div className="w-full max-w-2xl bg-blue-50 p-6 rounded-lg shadow-md border border-blue-500">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Registered Documents</h2>
            <div className="pl-5 space-y-2"> {/* Add space between each document */}
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <div key={index} className="py-2 px-4 bg-white rounded-md shadow-sm">
                    {doc}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No documents registered yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Register document box */}
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg mt-10 mb-5 border border-blue-500 bg-blue-50">
          <input
            type="text"
            value={documentName}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document name"
          />
          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
            <button
              onClick={handleEdit}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportingDocuments;
