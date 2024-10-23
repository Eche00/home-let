import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faBank, faPlugCirclePlus, faUserCog } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import { NavLink } from 'react-router-dom'; 
import MobileMenu from './MobileMenu';
import '../styles/MobileNav.css';
import '../styles/Header.css';

const MobileNav = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Conditionally hide mobile footer nav */}
            <div className={`mobile-footer-nav ${isMobileMenuOpen ? 'hide' : ''}`}>
               {/* Hide nav when the mobile menu sidebar is open */}
                <ul className='mobile-nav-links'>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => (isActive ? 'nav-active-link' : 'nav-inactive-link')}
                        >
                            <FontAwesomeIcon icon={faBank} className="nav-icon" />
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/properties"
                            className={({ isActive }) => (isActive ? 'nav-active-link' : 'nav-inactive-link')}
                        >
                            <FontAwesomeIcon icon={faSearch} className="nav-icon" />
                            Search
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/add"
                            className={({ isActive }) => (isActive ? 'nav-active-link' : 'nav-inactive-link')}
                        >
                            <FontAwesomeIcon icon={faPlugCirclePlus} className="nav-icon" />
                            Add
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contact-us"
                            className={({ isActive }) => (isActive ? 'nav-active-link' : 'nav-inactive-link')}
                        >
                            <FontAwesomeIcon icon={faUserCog} className="nav-icon" />
                            Contact
                        </NavLink>
                    </li>
                    <li>
                        <button className="nav-more-button" onClick={toggleMobileMenu}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </li>
                </ul>
            </div>

            {/* Show MobileMenu if it's open */}
            {isMobileMenuOpen && (
                <>
                    <div className={`nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
                    <MobileMenu closeMenu={closeMobileMenu} isOpen={isMobileMenuOpen} />
                </>
            )}
        </>
    );
};

export default MobileNav;
