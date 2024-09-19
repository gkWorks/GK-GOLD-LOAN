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

const App = () => {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="sticky top-0 z-10">
            <Navbar />
          </div>

          {/* Scrollable Content */}
          <main className="flex-1 p-4 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/master" element={<Master />} />
              <Route path="/customers" element={<Coustomers />} />
              <Route path="/gold-loan" element={<GoldLoan />} />
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
