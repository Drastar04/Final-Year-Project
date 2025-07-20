import React from 'react'

// src/components/ProfilePage.jsx
const ProfilePage = ({ user }) => {
  return (
    <div>
      <h3>My Profile</h3>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      {/* Add more profile details as needed */}
    </div>
  );
};

export default ProfilePage;
