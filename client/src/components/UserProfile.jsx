import React, { useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import { updateUserProfile } from '../api/auth'; // updated call

export default function UserProfile() {
  const {user, setUser} = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [tempEmail, setTempEmail] = useState(user.email);
  const [tempName, setTempName] = useState(user.name);


  //useEffect(() => {
  //  console.log("User context updated:", user);
  //}, [user]);


  // Sync temp fields when not editing
  useEffect(() => {
    if (!editMode) {
      setTempEmail(user.email);
      setTempName(user.name);
    }
  }, [user.email, user.name, editMode]);

  const handleSave = async () => {
    const emailUnchanged = tempEmail === user.email;
    const nameUnchanged = tempName === user.name;
  
    // If nothing has changed, don't send a request
    if (emailUnchanged && nameUnchanged) {
      setEditMode(false);
      return;
    }
  
    const payload = {
      email: emailUnchanged ? "" : tempEmail,
      name: nameUnchanged ? "" : tempName,
    };
  
    try {
      const response = await updateUserProfile(payload);
      console.log(response.data);
      const updatedUser = response.data.user;
      setEditMode(false);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  return (
    <div className="flex items-center space-x-4">
      {/* Circle with first letter of name or email */}
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
        {(user.name || user.email)?.charAt(0).toUpperCase()}
      </div>

      {/* Name, Email, Role */}
      <div className="flex flex-col gap-1">
        {editMode ? (
          <>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Name"
              className="border px-2 py-1 rounded"
            />
            <input
              type="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              placeholder="Email"
              className="border px-2 py-1 rounded"
            />
          </>
        ) : (
          <>
            <span>{tempName}</span>
            <span>{tempEmail}</span>
          </>
        )}
        <span>{user.role}</span>
      </div>

      {/* Edit/Save button */}
      <div>
        {editMode ? (
          <button
            onClick={handleSave}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
