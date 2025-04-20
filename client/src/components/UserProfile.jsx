import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Adjust the import path to your context

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext); // Access user data from AuthContext
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState(user); // Local state for editing user data

  useEffect(() => {
    // Update the temporary user state if the user context changes
    setTempUser(user);
  }, [user]);

  const handleChange = (e) => {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Update the user in the AuthContext after editing
    setUser(tempUser);
    setEditMode(false);
    alert('User data saved!');
    
    // You can add a backend call here to persist the changes
    // Example: updateUserProfile(tempUser).then(() => { ... });
  };

  if (!user) {
    return <div>Loading...</div>; // If user is not loaded yet
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6">
      <div className="flex-1">
        {editMode ? (
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              value={tempUser.name}
              onChange={handleChange}
              className="input w-full"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={tempUser.email}
              onChange={handleChange}
              className="input w-full"
              placeholder="Email"
            />
            <input
              type="text"
              name="role"
              value={tempUser.role}
              onChange={handleChange}
              className="input w-full"
              placeholder="Role"
            />
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{tempUser.name}</h2>
            <p className="text-gray-600">{tempUser.email}</p>
            <p className="text-gray-500 italic mb-2">{tempUser.role}</p>
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;