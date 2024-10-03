// GetDash.jsx
import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase'; 
import { signOut } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom';


const GetDash = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        // Get the current user from Firebase
        const currentUser = auth.currentUser; 
        if (currentUser) {
            // Set the user state if logged in
            setUser(currentUser); 
        } else {
            // Redirect to login if not logged
            navigate('/login'); 
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            // Call Firebase signOut
            await signOut(auth); 
            navigate('/login'); 
        } catch (error) {
            console.error('Logout error:', error); 
        }
    };

    return (
        <div className="dashboard">
          main get user component here
        </div>
    );
};

export default GetDash;
