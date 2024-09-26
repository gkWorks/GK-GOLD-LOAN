import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationGranted, setLocationGranted] = useState(false); // Track if location is granted
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log('Location received:', position.coords); // Log the received location
          setLocationGranted(true);
        },
        (error) => {
          setLocationError('Location access is required to log in. Please allow location access.');
          console.error("Error getting geolocation:", error);
          setLocationGranted(false);
        }
      );
    }
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!locationGranted) {
      setError('Location access is required to log in.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: username, //to debugging
        password: password, //to debugging
        latitude: location.latitude,
        longitude: location.longitude
      });
      
  
      console.log(response.data); // Check what is returned from the backend
  
      const { token, userType } = response.data;
  
      // Check if token and userType are valid
      if (!token) {
        setError('Failed to retrieve login token.');
        return;
      }
  
      // Save token and user type in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userType', userType);
  
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };
  

  return (
    <div className="relative h-screen overflow-hidden  bg-gradient-to-br from-[#89f7fe] to-[#66a6ff]" >
      {/* Floating bubbles */}
      <div className="bubble" />
      <div className="bubble" />
      <div className="bubble" />
      <div className="bubble" />

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>
          {locationError && <p className="text-red-600 text-center">{locationError}</p>} {/* Show location error */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">UserName</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-cyan-900 text-white font-bold py-2 rounded-lg ${locationGranted ? 'hover:bg-cyan-600' : 'opacity-50 cursor-not-allowed'}`} 
              disabled={!locationGranted} // Disable button if location not granted
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
