import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Users Box */}
        <div className="bg-blue-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>

        {/* Profit Box */}
        <div className="bg-blue-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Profit</h2>
          <p className="text-3xl font-bold">$12,345</p>
        </div>

        {/* Account Box */}
        <div className="bg-blue-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <p className="text-3xl font-bold">$56,789</p>
        </div>

        {/* Gold Rate Box */}
        <div className="bg-blue-900 text-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Gold Rate</h2>
          <p className="text-3xl font-bold">$1,890/oz</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
