import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/Header.css';
import '../styles/MobileNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import PcMenu from './PcMenu';
import MobileMenu from './MobileMenu';
import flat from "../assets/fiat.png";
import logo from '../assets/home-let-white.png';

const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    // State to hold authenticated user data
    const [user, setUser] = useState(null);
    // Loading state to handle the authentication check
    const [isLoading, setIsLoading] = useState(true);
    // Initialize useNavigate
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Firestore
        const db = getFirestore();

        // Function to fetch user data from Firestore
        const fetchUserData = async (uid) => {
            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    // Store the user data in state
                    setUser(userDoc.data());
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                // Set loading to false once data is fetched
                setIsLoading(false);
            }
        };

        // Check if a user is authenticated and fetch their data
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Fetch user data from Firestore using user ID
                fetchUserData(currentUser.uid);
            } else {
                // If no user, stop loading
                setIsLoading(false);
                // Set to null if not authenticated
                setUser(null);
            }
        });

        // Clean up the subscription
        return () => unsubscribe();
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Handle profile image click to navigate to dashboard
    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <div className="header">
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            <div className="menu">
                {/* PC menu, visible only on larger screens */}
                <div className='pcOnly'><PcMenu /></div>

                {/* Don't display anything while loading */}
                {!isLoading && (
                    <div className="mobile-menu-icon">
                        {user ? (
                            // if user is logged in, display profile photo
                            <img
                                src={user.profileImage || flat}
                                alt="User Profile"
                                className="profile-picture"
                                onClick={handleProfileClick}
                            />
                        ) : (
                            // if user is not logged in, display navbar
                            <FontAwesomeIcon icon={faBars} onClick={toggleMobileMenu} />
                        )}
                    </div>
                )}

                {/* Show MobileMenu if it's open */}
                {isMobileMenuOpen && (
                    <>
                        <div className={`nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
                        {/* mobile menu items */}
                        <MobileMenu closeMenu={closeMobileMenu} isOpen={isMobileMenuOpen} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
