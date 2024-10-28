import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import flat from "../assets/fiat.png";
import "../styles/Sidebar.css";

function SideItem({ closeMenu }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(flat);
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
          setUserGroup(userData.group || null);
          setProfilePhotoUrl(userData.profilePhotoUrl || flat);
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
        <img className="vendorProfileImage" src={profilePhotoUrl} alt="Profile" />
        <p className="vendorEmail">Hello, {user?.displayName || user?.email}!</p>
        {userGroup && <p className="userRG">User Group: {userGroup}</p>}
      </div>
      <div>
        <Link
          to="/"
          className={`routeLinks ${isActive("/") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          Dashboard
        </Link>
      </div>
      <div>
        <Link
          to="/profile"
          className={`routeLinks ${isActive("/profile") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          Profile
        </Link>
      </div>
      {userRole === "vendor" && (
        <>
          <div>
            <Link
              to="/add"
              className={`routeLinks ${isActive("/add") ? "active" : ""}`}
              onClick={() => { closeMenu(); }}
            >
              Add Property
            </Link>
          </div>
          <div>
            <Link
              to="/vendor-properties"
              className={`routeLinks ${isActive("/vendor-properties") ? "active" : ""}`}
              onClick={() => { closeMenu(); }}
            >
              Created Properties
            </Link>
          </div>
        </>
      )}

{userRole === "admin" && (
        <>
          <div>
            <Link
              to="/add"
              className={`routeLinks ${isActive("/add") ? "active" : ""}`}
              onClick={() => { closeMenu(); }}
            >
              Add Property
            </Link>
          </div>
          <div>
            <Link
              to="/vendor-properties"
              className={`routeLinks ${isActive("/vendor-properties") ? "active" : ""}`}
              onClick={() => { closeMenu(); }}
            >
              Created Properties
            </Link>
          </div>
          <div>
            <Link
              to="/new-transaction"
              className={`routeLinks ${isActive("/new-transaction") ? "active" : ""}`}
              onClick={() => { closeMenu(); }}
            >
             Add Transaction
            </Link>
          </div>
        </>
      )}
      <div>
        <Link
          to="/deposit"
          className={`routeLinks ${isActive("/deposit") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          Deposit
        </Link>
      </div>
      <div>
        <Link
          to="/withdrawal"
          className={`routeLinks ${isActive("/withdrawal") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          Withdrawal
        </Link>
      </div>
      <div>
        <Link
          to="/inspection"
          className={`routeLinks ${isActive("/inspection") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          Inspection
        </Link>
      </div>
      <div>
        <Link
          to="/history"
          className={`routeLinks ${isActive("/history") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          History
        </Link>
      </div>
      <div>
        <Link
          to="/settings"
          className={`routeLinks ${isActive("/settings") ? "active" : ""}`}
          onClick={() => { closeMenu(); }}
        >
          Settings
        </Link>
      </div>
      <button onClick={handleLogout} className="logout">
        Logout
      </button>
    </div>
  );
}

export default SideItem;
