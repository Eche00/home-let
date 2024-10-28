import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import flat from "../assets/fiat.png";
import "../styles/Sidebar.css";
import Loading from "../components/loading";

function Sidebar() {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userGroup, setUserGroup] = useState(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(flat); // Default to placeholder
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                setUser(authUser);
                // Fetch user profile from Firestore
                const userDocRef = doc(db, "users", authUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // Set user details from Firestore document
                    setUserRole(userData.role || null);
                    setUserGroup(userData.group || null);
                    setProfilePhotoUrl(userData.profilePhotoUrl || flat); // Use Firestore URL or default
                } else {
                    console.log("No user document found");
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        signOut(auth)
            .then(() => console.log("User signed out"))
            .catch((error) => console.error("Error signing out: ", error));
    };

    return (
        <div className="sidebar">
            <div className="userContainer">
                <img className="vendorProfileImage" src={profilePhotoUrl} alt="Profile" />
                <p className="vendorEmail">Hello, {user.displayName || user.email}!</p>
                {userGroup && <p className="userRG">User Group: {userGroup}</p>}
            </div>
            <Link to="/" className={`routeLinks ${isActive("/") ? "active" : ""}`}>
                Dashboard
            </Link>
            <Link to="/profile" className={`routeLinks ${isActive("/profile") ? "active" : ""}`}>
                Profile
            </Link>
            {userRole === "vendor" && (
                <>
                    <Link to="/add" className={`routeLinks ${isActive("/add") ? "active" : ""}`}>
                        Add Property
                    </Link>
                    <Link to="/vendor-properties" className={`routeLinks ${isActive("/vendor-properties") ? "active" : ""}`}>
                        Created Properties
                    </Link>
                </>
            )}

            {userRole === "admin" && (
                <>
                    <Link to="/add" className={`routeLinks ${isActive("/add") ? "active" : ""}`}>
                        Add Property
                    </Link>
                    <Link to="/vendor-properties" className={`routeLinks ${isActive("/vendor-properties") ? "active" : ""}`}>
                        Created Properties
                    </Link>
                    <Link to="/new-transaction" className={`routeLinks ${isActive("/new-transaction") ? "active" : ""}`}>
                        Add Transactions
                    </Link>
                </>
            )}

            <Link to="/deposit" className={`routeLinks ${isActive("/deposit") ? "active" : ""}`}>
                Deposit
            </Link>
            <Link to="/withdrawal" className={`routeLinks ${isActive("/withdrawal") ? "active" : ""}`}>
                Withdrawal
            </Link>
            <Link to="/inspection" className={`routeLinks ${isActive("/inspection") ? "active" : ""}`}>
                Inspection
            </Link>
            <Link to="/history" className={`routeLinks ${isActive("/history") ? "active" : ""}`}>
                History
            </Link>
            <Link to="/settings" className={`routeLinks ${isActive("/settings") ? "active" : ""}`}>
                Settings
            </Link>
            <button onClick={handleLogout} className="logout">
                Logout
            </button>
        </div>
    );
}

export default Sidebar;
