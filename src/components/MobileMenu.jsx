import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PcMenu from './PcMenu';

const MobileMenu = ({ closeMenu, isOpen }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
            <button className="close-button" onClick={closeMenu}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Mobile Menu</h2>

            {/* Render this part only if the user is authenticated */}
            {isAuthenticated ? (
                <ul className='pc-menu'>
                    <li>
                        <NavLink
                            exact="true"
                            to="/dashboard"
                            className={({ isActive }) => (isActive ? "active-link" : undefined)}
                            onClick={closeMenu} // Close menu on click
                        >
                            Dashboard
                        </NavLink>
                    </li>

                    {/* This will be replaced with contents of the sidebar when it is ready */}
                    <li>
                        <NavLink
                            to="/item1"
                            className={({ isActive }) => (isActive ? "active-link" : undefined)}
                            onClick={closeMenu}
                        >
                            Item 1
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/item2"
                            className={({ isActive }) => (isActive ? "active-link" : undefined)}
                            onClick={closeMenu}
                        >
                            Item 2
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/item3"
                            className={({ isActive }) => (isActive ? "active-link" : undefined)}
                            onClick={closeMenu}
                        >
                            Item 3
                        </NavLink>
                    </li>
                </ul>
            ) : (
                // Render PcMenu only if user is not authenticated
                <PcMenu closeMenu={closeMenu} />
            )}
        </div>
    );
};

export default MobileMenu;
