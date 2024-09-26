import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import updateprofile from '../assets/updateprofile.png';
import { FaCamera, FaPlus, FaTrash } from 'react-icons/fa';


const Customers = () => {
  const [documents, setDocuments] = useState([]);
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    Date: '',
    name: '',
    spouse: '',
    dob: '',
    age: '',
    gender: '',
    address: '',
    notes: '',
    mobileNo: '',
    email: '',
    aadhaarNo: '',
    panNo: '',
    customerId: '',
    idproof: '',
    image: '',
  });
  const [nominees, setNominees] = useState([{ nominee: '', relation: '' }]); // State for dynamic nominees

  const token = localStorage.getItem('authToken');
  console.log('Token being sent:', token); // Debug token

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/documents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDocuments(response.data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [token]);

  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    setDob(dobValue);
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      const calculatedAge = today.getFullYear() - birthDate.getFullYear();
      setAge(calculatedAge);
    } else {
      setAge('');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNomineeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNominees = [...nominees];
    updatedNominees[index][name] = value;
    setNominees(updatedNominees);
  };

  const addNominee = () => {
    setNominees([...nominees, { nominee: '', relation: '' }]);
  };

  const removeNominee = (index) => {
    const updatedNominees = nominees.filter((_, i) => i !== index);
    setNominees(updatedNominees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      dob: dob,
      age: age,
      image: capturedImage,
      nominees: nominees, // Include nominees in final data
    };

    try {
      const response = await axios.post('http://localhost:5000/api/customers', {finalData}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Customer Registered:', response.data);
      
      // Reset form after successful submission
      setFormData({
        Date: '',
        name: '',
        spouse: '',
        dob: '',
        age: '',
        gender: '',
        address: '',
        notes: '',
        mobileNo: '',
        email: '',
        aadhaarNo: '',
        panNo: '',
        customerId: '',
        idproof: '',
        image: ''
      });
      setCapturedImage(null);
      setDob('');
      setAge('');
      setNominees([{ nominee: '', relation: '' }]); // Reset nominees
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const toggleCamera = async () => {
    if (!isCameraActive) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
        setIsCameraActive(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setStream(null);
      }
      setIsCameraActive(false);
    }
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageUrl = canvas.toDataURL('image/png');
    setCapturedImage(imageUrl); // Set the captured image
    closePopup(); // Close the popup after capturing
  };
  
  
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
  
  
  
  const openPopup = () => {
    setIsPopupOpen(true);
    toggleCamera(); // Start the camera
  };
  
  const closePopup = () => {
    setIsPopupOpen(false);
    toggleCamera(); // Stop the camera
  };
  
  return (
    <form onSubmit={handleSubmit}>
    <div className="flex-grow">
      <h1 className="text-3xl font-bold mb-4 text-center pt-10 pb-10">Customers Registration</h1>
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Registration Date</label>
              <input
                type="date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
      <div className="flex h-5/6">
        <div className="w-2/3 p-4 flex flex-col justify-start space-y-2">
          <div className="flex space-x-2">
          {/* Registration Date and Name */}
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Fa/Spouse</label>
              <input
                type="text"
                name="spouse"
                value={formData.spouse}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
  
            <div>
              <label className="block text-xs font-bold mb-1">Mobile No</label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          {/* Spouse and Date of Birth */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={dob}
                onChange={handleDobChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Age</label>
              <input
                type="text"
                value={age}
                readOnly
                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Aadhaar No</label>
            <input
              type="text"
              name="aadhaarNo"
              value={formData.aadhaarNo}
              onChange={handleChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
  
          <div className="flex space-x-2">
          {/* Age and Gender */}
          <div className="w-1/2">
            <label className="block text-xs font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
  
          <div>
            <label className="block text-xs font-bold mb-1">PAN No</label>
            <input
              type="text"
              name="panNo"
              value={formData.panNo}
              onChange={handleChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          {/* Mobile No and Customer ID */}
          <div className="flex space-x-2">
          <div className="w-1/2">
            <label className="block text-xs font-bold mb-1">ID Proof</label>
            <select
              name="idproof"
              value={formData.idproof}
              onChange={handleChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select ID proof type</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc.documentName}>
                  {doc.documentName}
                </option>
              ))}
            </select>
          </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">ID No</label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
  
          {/* ID Proof, Email, Aadhaar, PAN, Nominee, Relation, and Address */}
          <div className="w-full mt-4">
          <label className="block text-xs font-bold mb-1">Nominees</label>
          {nominees.map((nomineeData, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <div className="w-1/2">
                <input
                  type="text"
                  name="nominee"
                  placeholder="Nominee"
                  value={nomineeData.nominee}
                  onChange={(e) => handleNomineeChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="w-1/2">
              <label className="block text-xs font-bold mb-1">Relation</label>
                <input
                  type="text"
                  name="relation"
                  placeholder="Relation"
                  value={nomineeData.relation}
                  onChange={(e) => handleNomineeChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNominee(index)}
                className="px-2 py-1 bg-red-500 text-white rounded shadow-md"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addNominee}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded shadow-md"
          >
            <FaPlus /> Add Nominee
          </button>
        </div>
  
          <div>
            <label className="block text-xs font-bold mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
  
        {/* Right side: Profile Picture (image capture + default) */}
        <div className="w-1/3 flex flex-col pt-40 items-center">
          <div className="relative mb-4">
            <img
              src={capturedImage || updateprofile}
              alt="Profile"
              className="w-32 h-32 object-cover"
            />
            <button
              type="button"
              onClick={openPopup}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-300"
            >
              <FaCamera />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleImportClick}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => setCapturedImage(null)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Clear
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileImport}
            className="hidden"
          />
      <div className="flex space-x-2 pt-60 pl-80 p-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded shadow-md"
        >
          Save
        </button>
        </div>
        </div>
      </div>
  
      {/* Save and Close Buttons */}
      {/* Popup for camera capture */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-500 bg-opacity-75">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <video ref={videoRef} style={{ display: 'block', width: '100%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleCapture}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </form>
);
};

export default Customers;
