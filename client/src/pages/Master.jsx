import React from 'react';
import { Link } from 'react-router-dom';

const Master = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">MASTER OPTIONS</h1>
      <div className="space-y-4">
        <Link
          to="/jewel-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Jewel Master
        </Link>
        <Link
          to="/supporting-documents"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Supporting Document For GL
        </Link>
        <Link
          to="/gold-loan-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Gold Loan Master
        </Link>
        <Link
          to="/fd-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          FD Master
        </Link>
        <Link
          to="/rd-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          RD Master
        </Link>
        <Link
          to="/re-pledgers"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Re-Pledgers
        </Link>
        <Link
          to="/misc-heads"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Misc Heads Master
        </Link>
        <Link
          to="/currency-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Currency Master
        </Link>
        <Link
          to="/bank-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Banks Master
        </Link>
        <Link
          to="/cashless-master"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Cashless Master
        </Link>
        <Link
          to="set defaults"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Set Defaults
        </Link>
        <Link
          to="/re-pledgers"
          className="block text-xl font-semibold hover:text-blue-500 transition duration-300"
        >
          Re-Pledgers
        </Link>
      </div>
    </div>
  );
};

export default Master;
