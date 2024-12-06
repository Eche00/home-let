import React from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
  const { userId } = useParams(); // Get the userId from the URL

  // Now you can use the userId to fetch data or display the user profile
  return (
    <div>
      <h1>User Profile: {userId}</h1>
      {/* Fetch and display user data here */}
    </div>
  );
};

export default User;
