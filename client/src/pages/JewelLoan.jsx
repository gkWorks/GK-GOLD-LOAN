import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

const JewelLoan = () => {
  const token = localStorage.getItem("authToken");
  const [loanNames, setLoanNames] = useState([]);
  console.log("Token being sent:", token); // Debug token
  const [loanTypes, setLoanTypes] = useState([]); // State to hold loan types
  const [selectedLoanType, setSelectedLoanType] = useState(""); // State for selected loan type
  const [todayDate, setTodayDate] = useState("");
  const [custId, setCustId] = useState("");
  const [customerData, setCustomerData] = useState({
    name: "",
    address: "",
    mobileNo: "",
    image: "",
  });
  const [items, setItems] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: "",
      description: "",
      qty: "",
      grWt: "",
      defaLess: "",
      lessWt: "",
      netWt: "",
    }))
  );

  const [jewelItems, setJewelItems] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [goldRate, setGoldRate] = useState(""); // New state for Gold Rate

  const webcamRef = useRef(null); // Using useRef to persist the webcam reference

  const fileInputRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayDate(today);
  }, []);

  // Fetch Jewel items from the jewel master
  useEffect(() => {
    const fetchJewelItems = async () => {
      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/jewel-master", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort items in alphabetical order by itemName
        const sortedJewelItems = response.data.sort((a, b) =>
          a.itemName.localeCompare(b.itemName)
        );

        setJewelItems(sortedJewelItems);
      } catch (error) {
        console.error("Error fetching jewel items:", error);
      }
    };

    fetchJewelItems();
  }, [token]);

  const handleKeyPress = (e, rowIndex, fieldIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextFieldIndex = fieldIndex + 1;
      if (nextFieldIndex < 8) {
        const nextElement = document.getElementById(
          `input-${rowIndex}-${nextFieldIndex}`
        );
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  };

  const calculateTotal = (key) => {
    return items.reduce((total, item) => {
      const value = parseFloat(item[key]) || 0;
      return total + value;
    }, 0);
  };

  const calculateNetTotal = () => {
    return items.reduce((total, item) => {
      const grWt = parseFloat(item.grWt) || 0;
      const defaLess = parseFloat(item.defaLess) || 0;
      const lessWt = parseFloat(item.lessWt) || 0;
      const netWt = grWt - defaLess - lessWt;
      return total + netWt;
    }, 0);
  };

   // New function to calculate Max Loan Availed
   const calculateMaxLoanAvailed = () => {
    const netTotalWeight = calculateNetTotal();
    const rate = parseFloat(goldRate) || 0;
    return (netTotalWeight * rate).toFixed(2); // Max Loan Availed
  };

  const handleSearchCustomer = async () => {
    console.log(`Searching for Customer ID: ${custId}`);
    try {
      const token = localStorage.getItem("authToken"); // or however you're storing the token
      const response = await axios.get(
        `http://localhost:5000/api/customers/customers/${custId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const customer = response.data;
      console.log("Response:", customer); // Log the response

      if (customer) {
        setCustomerData({
          name: customer.name || "",
          address: customer.address || "",
          mobileNo: customer.mobileNo || "",
          image: customer.image || "", // Ensure you have the image URL or base64 data
        });
        console.log("Customer Data Updated");
      } else {
        alert("Customer not found or error fetching data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      alert("Error fetching customer data");
    }
  };

  // Capture image function
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false); // Close the camera after capturing
  };

  const handleClearImage = () => {
    setCapturedImage(null);
  };

  const handleImport = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result); // Set the image as base64 data
      };
      reader.readAsDataURL(file); // Read the file as a Data URL (base64)
    }
  };

  // Fetch loan types from the backend
  useEffect(() => {
    const fetchLoanNames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/gold-loans/names",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLoanNames(response.data.map((loan) => loan.loanName));
      } catch (error) {
        console.error("Error fetching loan names:", error);
      }
    };
    fetchLoanNames();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1 -mt-5 flex items-center justify-center ">
        Jewel Loan Form
      </h1>
      <div className="bg-blue-500 text-white p-4 rounded-md mb-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <label className="font-medium">GL No:</label>
            <input
              type="text"
              placeholder="Prefix"
              className="border border-gray-300 p-2 rounded w-16 text-black"
            />
            <input
              type="text"
              placeholder="GL No"
              className="border border-gray-300 p-2 rounded w-32 text-black"
            />
          </div>
          <div>
            <input
              type="date"
              value={todayDate}
              onChange={(e) => setTodayDate(e.target.value)}
              className="border border-gray-300 p-2 rounded text-black"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-500 text-white p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <label className="font-medium">Cust ID:</label>
            <input
              type="text"
              value={custId}
              onChange={(e) => setCustId(e.target.value)}
              placeholder="Search Cust ID"
              className="border border-gray-300 p-2 rounded text-black"
            />
            <button
              className="bg-white text-blue-500 p-2 rounded"
              onClick={handleSearchCustomer}
            >
              Search
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-medium">Loan Type:</label>
            <select className="border border-gray-300 p-2 rounded text-black">
              <option value="" disabled>
                Select Loan Type
              </option>
              {loanNames.map((loanName, index) => (
                <option key={index} value={loanName}>
                  {loanName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-300 p-4 rounded-md mb-4 flex justify-between">
        <div className="flex flex-col space-y-4 w-1/2">
          <div className="flex items-center">
            <label className="font-medium w-24">Name:</label>
            <input
              type="text"
              value={customerData.name}
              placeholder="Enter Name"
              className="border border-gray-400 p-2 rounded w-96"
              readOnly // Optional: make it read-only to avoid manual edits
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium w-24">Address:</label>
            <textarea
              rows="3"
              value={customerData.address}
              placeholder="Enter Address"
              className="border border-gray-400 p-2 rounded w-96 resize-none"
              readOnly // Optional: make it read-only
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium w-24">Mobile No:</label>
            <input
              type="text"
              value={customerData.mobileNo}
              placeholder="Enter Mobile No"
              className="border border-gray-400 p-2 rounded w-96"
              readOnly // Optional: make it read-only
            />
          </div>
        </div>

        {/* New fields */}
        <div className="flex flex-col space-y-4 w-1/2 ml-8">
          <div className="flex items-center">
            <div>
              <label className="font-medium w-16 ">Max Days:</label>
              <input
                type="text"
                placeholder="Max Days"
                className="border border-gray-400 p-2 rounded w-20"
                maxLength="3"
              />
            </div>
            <div className="ml-10">
              <label className="font-medium">Due Day:</label>
              <input
                type="date"
                placeholder="Due Day"
                className="border border-gray-400 p-2 rounded ml-2"
                maxLength="3"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <label className="font-medium w-16">Gold Rate:</label>
              <input
                type="text"
                placeholder="Gold Rate"
                value={goldRate}
                onChange={(e) => setGoldRate(e.target.value)}
                className="border border-gray-400 p-2 rounded w-24"
                maxLength="4"
              />
            </div>
            <div className="ml-6">
              <label className="font-medium ">Min. Wt:</label>
              <input
                type="text"
                placeholder="Min Wt"
                className="border border-gray-400 p-2 rounded w-20 ml-3"
                maxLength="4"
              />
            </div>
          </div>
          <div className="flex items-center">
            <label className="font-medium w-16">Interest:</label>
            <textarea
              rows="4"
              placeholder="Interest"
              className="border border-gray-400 p-2 rounded w-52 resize-none"
            />
          </div>
        </div>

        <div className="bg-gray-500 text-white flex items-center justify-center rounded w-40 h-40 ml-8 shadow-md">
          {customerData.image ? (
            <img
              src={customerData.image}
              alt="Customer"
              className="object-cover w-full h-full"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
      </div>

      <div className="flex mb-4">
        <div className="flex-grow">
          <h2 className="text-xl font-bold mb-2">Jewel Items</h2>
          <div className="overflow-auto max-h-80 border border-gray-300 rounded-md">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">S.No</th>
                  <th className="border border-gray-300 p-2">Item Name</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">QTY</th>
                  <th className="border border-gray-300 p-2">Gr.WT</th>
                  <th className="border border-gray-300 p-2">Defa less</th>
                  <th className="border border-gray-300 p-2">Less WT</th>
                  <th className="border border-gray-300 p-2">NET WT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, rowIndex) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">{item.id}</td>
                    <td className="border border-gray-300 p-2">
                      <select
                        id={`input-${rowIndex}-0`}
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[rowIndex].name = e.target.value;
                          setItems(newItems);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, rowIndex, 0)}
                        className="border border-gray-300 p-1 rounded w-full bg-white text-black"
                      >
                        <option value="">Select Jewel</option>
                        {jewelItems.map((jewel) => (
                          <option key={jewel._id} value={jewel.itemName}>
                            {jewel.itemName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        id={`input-${rowIndex}-1`}
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[rowIndex].description = e.target.value;
                          setItems(newItems);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, rowIndex, 1)}
                        className="border border-gray-300 p-1 rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        id={`input-${rowIndex}-2`}
                        type="text"
                        value={item.qty}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[rowIndex].qty = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setItems(newItems);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, rowIndex, 2)}
                        className="border border-gray-300 p-1 rounded w-16"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        id={`input-${rowIndex}-3`}
                        type="text"
                        value={item.grWt}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, ""); // Keep the raw input
                          const newItems = [...items];
                          newItems[rowIndex].grWt = value; // Store the raw value
                          setItems(newItems);
                        }}
                        onBlur={(e) => {
                          const value =
                            parseFloat(
                              e.target.value.replace(/[^0-9.]/g, "")
                            ) || 0;
                          const formattedValue = value.toFixed(3); // Format on blur
                          const newItems = [...items];
                          newItems[rowIndex].grWt = formattedValue; // Update with formatted value
                          setItems(newItems);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, rowIndex, 3)}
                        className="border border-gray-300 p-1 rounded w-16"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        id={`input-${rowIndex}-4`}
                        type="text"
                        value={item.defaLess}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          const newItems = [...items];
                          newItems[rowIndex].defaLess = value;
                          setItems(newItems);
                        }}
                        onBlur={(e) => {
                          const value =
                            parseFloat(
                              e.target.value.replace(/[^0-9.]/g, "")
                            ) || 0;
                          const formattedValue = value.toFixed(3);
                          const newItems = [...items];
                          newItems[rowIndex].defaLess = formattedValue;
                          setItems(newItems);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, rowIndex, 4)}
                        className="border border-gray-300 p-1 rounded w-16"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        id={`input-${rowIndex}-5`}
                        type="text"
                        value={item.lessWt}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          const newItems = [...items];
                          newItems[rowIndex].lessWt = value;
                          setItems(newItems);
                        }}
                        onBlur={(e) => {
                          const value =
                            parseFloat(
                              e.target.value.replace(/[^0-9.]/g, "")
                            ) || 0;
                          const formattedValue = value.toFixed(3);
                          const newItems = [...items];
                          newItems[rowIndex].lessWt = formattedValue;
                          setItems(newItems);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, rowIndex, 5)}
                        className="border border-gray-300 p-1 rounded w-16"
                      />
                    </td>

                    <td className="border border-gray-300 p-2">
                      {(
                        parseFloat(item.grWt || 0) -
                          parseFloat(item.defaLess || 0) -
                          parseFloat(item.lessWt || 0) || 0
                      ).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Total container */}
          <div className="bg-blue-500 text-white p-2 rounded-md   mt-4">
            <div className="flex justify-between">
              <p>
                <strong>Total Quantity:</strong> {calculateTotal("qty")}
              </p>
              <p>
                <strong>Total Gr. WT:</strong>{" "}
                {calculateTotal("grWt").toFixed(3)}
              </p>
              <p>
                <strong>Total Defa Less:</strong>{" "}
                {calculateTotal("defaLess").toFixed(3)}
              </p>
              <p>
                <strong>Total Less WT:</strong>{" "}
                {calculateTotal("lessWt").toFixed(3)}
              </p>
              <p>
                <strong>Net Weight:</strong> {calculateNetTotal().toFixed(3)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-500 text-white flex flex-col items-center justify-center rounded w-40 h-40 shadow-md ml-4 relative">
          {capturedImage ? (
            <img
              src={capturedImage} // Display the captured or imported image
              alt="Captured"
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="flex items-center justify-center h-full w-full">
              No Image
            </span>
          )}
          <button
            onClick={() => setShowCamera(true)}
            className="absolute bottom-2 right-2 bg-white text-blue-500 p-2 rounded-full"
          >
            📸
          </button>
          <div>
            <button
              onClick={handleClearImage}
              className="bg-red-500 text-white p-2 rounded"
            >
              Clear
            </button>
            <button
              onClick={() => fileInputRef.current.click()} // Trigger file input click
              className="bg-blue-500 text-white p-2 rounded"
            >
              Import
            </button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImport} // Attach the handler to file input change event
            />
          </div>
        </div>
      </div>

      {showCamera && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={handleCapture}
                className="bg-green-500 text-white p-2 rounded"
              >
                Capture
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex ">
        <div className="flex  items-center mb-2">
          <label className="font-medium">Narration:</label>
          <input
            type="text"
            placeholder="Enter narration"
            className="border border-gray-300 rounded w-40 text-black ml-1"
          />
        </div>
        <div className="flex  items-center  mb-2  ml-48">
        <strong>Max Loan Availed:</strong> 
          <input
           value={calculateMaxLoanAvailed()}
            type="text"
            placeholder="Max loan availed"
            className="border border-gray-300 rounded w-52 text-black ml-1"
          />
        </div>
      </div>

      <div className="flex ">
        <div className="bg-green-500 text-white p-2 w-20 rounded ">
          <button className="pl-4">Save</button>
        </div>
        <div className="bg-red-500 text-white p-2 w-20 rounded ml-5">
          <button className="pl-4">Clear</button>
        </div>
        <div className=" bg-blue-400 text-white p-2 rounded ml-96">
          <button>Print Loan Form</button>
        </div>
      </div>
    </div>
  );
};

export default JewelLoan;
