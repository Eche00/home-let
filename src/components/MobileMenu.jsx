import React from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const MobileMenu = ({ closeMenu, isOpen }) => {
    return (
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
            <button className="close-button" onClick={closeMenu}>
            <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Mobile Menu</h2>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ul>
        </div>
    );
};

export default MobileMenu;
