import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase'; // Use named import
import '../styles/Footer.css';
import MobileNav from './MobileNav';

const Footer = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Subscribe to Firebase authentication state
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    
    return (
        <div className='footer'>
            {!user && <div className='pc-footer'>All Rights Reserved</div>}
            {user && (
                <div className='mob-footer'>
                    <MobileNav />
                </div>
            )}
        </div>
    );
}

export default Footer;
