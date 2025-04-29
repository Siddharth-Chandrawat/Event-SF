import React from 'react';
import UserProfile from '../components/UserProfile';
import Navbar from '../components/Navbar';

const UserPage = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfile />
      </div>
    </div>
    </>
  );
};

export default UserPage;