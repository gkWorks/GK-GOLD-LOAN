import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Master from './pages/Master';
import Dashboard from './pages/Dashboard';
import JewelMaster from './MasterComponents/JewelMaster';
import SupportingDocuments from './MasterComponents/SupportingDocuments';
import GoldLoanMaster from './MasterComponents/GoldLoanMaster';
import FDMaster from './MasterComponents/FDMaster';
import RDMaster from './MasterComponents/RDMaster';
import RePledgers from './MasterComponents/RePledgers';
import Customers from './pages/Coustomers';
import GoldLoan from './pages/GoldLoan';
import Login from './components/Login';
import CustomerSerch from './components/CustomerSerch';
import JewelLoan from './pages/JewelLoan';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Navbar and Sidebar */}
        <Route path="*" element={
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 p-4 overflow-y-auto">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/master" element={<Master />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/CustomerSerch" element={<CustomerSerch />} />
                  <Route path="/gold-loan" element={<GoldLoan />} />
                  <Route path="/jewel-loan" element={<JewelLoan />} />
                  <Route path="/jewel-master" element={<JewelMaster />} />
                  <Route path="/supporting-documents" element={<SupportingDocuments />} />
                  <Route path="/gold-loan-master" element={<GoldLoanMaster />} />
                  <Route path="/fd-master" element={<FDMaster />} />
                  <Route path="/rd-master" element={<RDMaster />} />
                  <Route path="/re-pledgers" element={<RePledgers />} />
                  {/* Redirect to dashboard or a default page if no match */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
