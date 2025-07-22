import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/Sidebar.css";
import Mini from "./MobileMini";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faPlus, faHistory, faCog, faClipboardCheck, faSignOutAlt, faCommentsDollar, faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";

function SideItem({ closeMenu }) {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const userDocRef = doc(db, "users", authUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserRole(userData.role || null);
                } else {
                    console.log("No user document found");
                }
            } else {
                setUser(null); // You can handle user state here if needed
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        signOut(auth)
            .then(() => console.log("User signed out"))
            .catch((error) => console.error("Error signing out: ", error));
        closeMenu();
    };

    return (
        <div className="sidebars">
            <div className="userContainer">
                <Mini closeMenu={closeMenu} />
            </div>
            <div className="side-item">
                <Link
                    to="/"
                    className={`routeLinks ${isActive("/") ? "active" : ""}`}
                    onClick={() => { closeMenu(); }}
                >
                    <FontAwesomeIcon icon={faHome} className="icon" />  Dashboard
                </Link>
            </div>
            {(userRole === "admin" || userRole === "vendor") && (
                <>
                    <div className="side-item">
                        <Link to="/add" className={`routeLinks ${isActive("/add") ? "active" : ""}`} onClick={() => { closeMenu(); }}>
                            <FontAwesomeIcon icon={faPlus} className="icon" /> Add Property
                        </Link>
                    </div>
                    <div className="side-item">
                        <Link to="/vendor-properties" className={`routeLinks ${isActive("/vendor-properties") ? "active" : ""}`} onClick={() => { closeMenu(); }}>
                            <FontAwesomeIcon icon={faClipboardCheck} className="icon" /> Created Properties
                        </Link>
                    </div>
                </>
            )}
            {userRole === "admin" && (
                <>
                    <div className="side-item">
                        <Link to="/users" className={`routeLinks ${isActive("/users") ? "active" : ""}`} onClick={() => { closeMenu(); }}>
                            <FontAwesomeIcon icon={faUser} className="icon" /> All Users
                        </Link>
                    </div>
                    <div className="side-item">
                        <Link to="/new-transaction" className={`routeLinks ${isActive("/new-transaction") ? "active" : ""}`} onClick={() => { closeMenu(); }}>
                            <FontAwesomeIcon icon={faPlus} className="icon" /> Add Transactions
                        </Link>
                    </div>
                </>
            )}
            <div className="side-item">
                <Link
                    to="/deposit"
                    className={`routeLinks ${isActive("/deposit") ? "active" : ""}`}
                    onClick={() => { closeMenu(); }}
                >
                    <FontAwesomeIcon icon={faCommentsDollar} className="icon" /> Deposit
                </Link>
            </div>
            <div className="side-item">
                <Link
                    to="/withdrawal"
                    className={`routeLinks ${isActive("/withdrawal") ? "active" : ""}`}
                    onClick={() => { closeMenu(); }}
                >
                    <FontAwesomeIcon icon={faCircleDollarToSlot} className="icon" /> Withdrawal
                </Link>
            </div>
            <div className="side-item">
                <Link
                    to="/inspection"
                    className={`routeLinks ${isActive("/inspection") ? "active" : ""}`}
                    onClick={() => { closeMenu(); }}
                >
                    <FontAwesomeIcon icon={faClipboardCheck} className="icon" /> Inspection
                </Link>
            </div>
            <div className="side-item">
                <Link
                    to="/history"
                    className={`routeLinks ${isActive("/history") ? "active" : ""}`}
                    onClick={() => { closeMenu(); }}
                >
                    <FontAwesomeIcon icon={faHistory} className="icon" /> History
                </Link>
            </div>
            <div className="side-item">
                <Link
                    to="/settings"
                    className={`routeLinks ${isActive("/settings") ? "active" : ""}`}
                    onClick={() => { closeMenu(); }}
                >
                    <FontAwesomeIcon icon={faCog} className="icon" /> Settings
                </Link>
            </div>
            <button onClick={handleLogout} className="logout">
                <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
            </button>
        </div>
    );
}

export default SideItem;
