import React from 'react';
import UserProfile from '../components/UserProfile';
import UserEvents from '../components/UserEvents';
import Navbar from '../components/Navbar';

const UserPage = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfile />
        <UserEvents />
      </div>
    </div>
    </>
  );
};

export default UserPage;