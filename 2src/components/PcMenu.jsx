import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../styles/PcMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const PcMenu = ({ closeMenu }) => {
    // Accept closeMenu as a prop { closeMenu}
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev); // Toggle the dropdown
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <ul className="pc-menu">
            {!isAuthenticated && (
                <li>
                    <NavLink
                        exact="true"
                        to="/"
                        className={({ isActive }) => (isActive ? "active-link" : undefined)}
                        onClick={closeMenu} // Close menu on click
                    >
                        Home
                    </NavLink>
                </li>
            )}
            <li className="dropdown" ref={dropdownRef}>
                <span onClick={toggleDropdown} className="dropdown-toggle">
                    Our Services <FontAwesomeIcon icon={faCaretDown} />
                </span>
                {showDropdown && (
                    <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                        <li>
                            <NavLink
                                to="/about-us"
                                className={({ isActive }) => (isActive ? "active-link" : undefined)}
                                onClick={closeMenu}
                            >
                                About Us
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/contact-us"
                                className={({ isActive }) => (isActive ? "active-link" : undefined)}
                                onClick={closeMenu}
                            >
                                Contact Us
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/terms"
                                className={({ isActive }) => (isActive ? "active-link" : undefined)}
                                onClick={closeMenu}
                            >
                                Terms and Conditions
                            </NavLink>
                        </li>
                    </ul>
                )}
            </li>
            <li>
                <NavLink
                    to="/properties"
                    className={({ isActive }) => (isActive ? "active-link" : undefined)}
                    onClick={closeMenu}
                >
                    Find Properties
                </NavLink>
            </li>
            {!isAuthenticated && (
                <>
                    <li>
                        <NavLink
                            to="/register"
                            className={({ isActive }) => (isActive ? "active-link" : undefined)}
                            onClick={closeMenu}
                        >
                            Register
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/login"
                            className={({ isActive }) => (isActive ? "active-link" : undefined)}
                            onClick={closeMenu}
                        >
                            Login
                        </NavLink>
                    </li>
                </>
            )}
        </ul>
    );
};

export default PcMenu;
