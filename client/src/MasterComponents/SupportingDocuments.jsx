import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this document?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SupportingDocuments = () => {
  const [documentName, setDocumentName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noDocumentsPopup, setNoDocumentsPopup] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const token = localStorage.getItem("authToken"); // Get the token from localStorage
  console.log("Token being sent:", token); // Debug token

  useEffect(() => {
    // Fetch documents from backend when component mounts
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/documents",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
            },
          }
        );
        console.log("Fetched documents:", response.data.documents); // Add this line
        setDocuments(response.data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, [token]);

  const handleInputChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleRegister = async () => {
    const trimmedDocumentName = documentName.trim(); // Trim whitespace

    if (trimmedDocumentName) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/register",
          { documentName: trimmedDocumentName },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
            },
          }
        );
        const newDocument = response.data.document; // Now this should contain the saved document
        console.log("New document:", newDocument); // Debug line
        setDocuments((prevDocuments) => [...prevDocuments, newDocument]); // Use the updater function for state
        setDocumentName("");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } catch (error) {
        console.error("Error registering document:", error);
      }
    }
  };

  const handleEdit = () => {
    if (documents.length === 0) {
      setNoDocumentsPopup(true);
      setTimeout(() => setNoDocumentsPopup(false), 2000);
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleDeleteInitiate = (id) => {
    setDocumentToDelete(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (documentToDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/api/documents/${documentToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
            },
          }
        );
        // Update the state to remove the deleted document
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc._id !== documentToDelete)
        );
        setModalOpen(false);
        setDocumentToDelete(null);
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Document Name Master
        </h1>
      </div>

      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Document Registered!
        </div>
      )}

      {noDocumentsPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          No documents available to edit!
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between items-center pb-20">
        <div className="space-y-10 w-full max-w-2xl">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-500">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Registered Documents
            </h2>
            <div className="space-y-2">
              {documents.length > 0 ? (
                documents.map((doc) => {
                  // Check if doc is defined and has the documentName property
                  if (doc && doc.documentName) {
                    return (
                      <div
                        key={doc._id || Math.random()} // Ensure a unique key even if _id is undefined
                        className={`py-2 px-4 bg-white rounded-md shadow-sm flex justify-between items-center transition-transform duration-500 w-full ${
                          isEditing ? "transform scale-105 translate-x-2" : ""
                        }`}
                      >
                        <span className="break-all">{doc.documentName}</span>
                        {isEditing && (
                          <button
                            onClick={() => handleDeleteInitiate(doc._id)} // Initiate delete
                            className="text-red-500 hover:text-red-700 transition duration-300"
                          >
                            <FaTrashAlt />
                          </button>
                        )}
                      </div>
                    );
                  }
                  return null; // Return null if doc is undefined or missing documentName
                })
              ) : (
                <div className="text-gray-500">No documents registered yet</div>
              )}
            </div>
          </div>
        </div>

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
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                isEditing
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isEditing ? "Stop Editing" : "Edit"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default SupportingDocuments;
