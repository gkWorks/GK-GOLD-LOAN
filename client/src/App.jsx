import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Master from './pages/Master';
import Dashboard from './pages/Dashboard';
import JewelMaster from './MasterComponents/JewelMaster'; // Create these components
import SupportingDocuments from './MasterComponents/SupportingDocuments';
import GoldLoanMaster from './MasterComponents/GoldLoanMaster';
import FDMaster from './MasterComponents/FDMaster';
import RDMaster from './MasterComponents/RDMaster';
import RePledgers from './MasterComponents/RePledgers';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/master" element={<Master/>} />
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
  );
};

export default App;
