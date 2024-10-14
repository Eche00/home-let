import React, { useState } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import PcMenu from './PcMenu';
import MobileMenu from './MobileMenu';

const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="header">
            <div className="logo">
                <img src="/path-to-your-logo/logo.png" alt="Logo" />
            </div>
            <div className="menu">
                {/* PC menu, visible only on larger screens */}
                <PcMenu />
                <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                {/* Show MobileMenu if it's open */}
                {isMobileMenuOpen && (
                    <>
                        <div className={`overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
                        <MobileMenu closeMenu={closeMobileMenu} isOpen={isMobileMenuOpen} />
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
