import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Coustomers from './pages/Coustomers';
import GoldLoan from './pages/GoldLoan';
<<<<<<< HEAD

=======
import Login from './components/Login';
>>>>>>> 323ca99da57ff713824f170adf159cf5c953cdf5
const App = () => {
  return (
    <>
    

    <Router>
<<<<<<< HEAD
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Content Area */}
=======

    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
      <div className="flex h-screen">
        <Sidebar />
>>>>>>> 323ca99da57ff713824f170adf159cf5c953cdf5
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="sticky top-0 z-10">
            <Navbar />
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 p-4 overflow-auto">
            <Routes>
<<<<<<< HEAD
              <Route path="/" element={<Dashboard />} />
              <Route path="/master" element={<Master />} />
              <Route path="/customers" element={<Coustomers />} />
              <Route path="/gold-loan" element={<GoldLoan />} />
=======
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/master" element={<Master/>} />
              <Route path="/customers" element={<Coustomers/>} />
              <Route path="/gold-loan" element={<GoldLoan/>} />
>>>>>>> 323ca99da57ff713824f170adf159cf5c953cdf5
              <Route path="/jewel-master" element={<JewelMaster />} />
              <Route path="/supporting-documents" element={<SupportingDocuments />} />
              <Route path="/gold-loan-master" element={<GoldLoanMaster />} />
              <Route path="/fd-master" element={<FDMaster />} />
              <Route path="/rd-master" element={<RDMaster />} />
              <Route path="/re-pledgers" element={<RePledgers />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
    </>
  );
};

export default App;
