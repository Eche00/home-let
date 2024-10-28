import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PcMenu from './PcMenu';
import SideItem from '../dashboards/SideItem';

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
            {isAuthenticated ? (
                <>
                    {/* Pass closeMenu to SideItem */}
                    <SideItem closeMenu={closeMenu} />
                </>
            ) : (
                <PcMenu closeMenu={closeMenu} />
            )}
        </div>
    );
};

export default MobileMenu;
