import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/MiniDash.css";
import flat from "../assets/fiat.png";
import Avatar from "@mui/material/Avatar";

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="dashboardContainer">
    <div className="profileSection">
      <div className="skeletonImage" />
      <div className="profileDetails">
        <div className="skeletonText skeletonName" />
        <div className="skeletonText skeletonEmail" />
        <div className="skeletonText skeletonButton" />
      </div>
    </div>
  </div>
);

function MiniDash({ closeMenu }) {
  // Accept closeMenu as a prop
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // handle authentication change
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            role: userData.role,
            name: userData.fullName || "Guest User",
            email: userData.email || currentUser.email,
            profilePhotoUrl:
              userData.profileImage || currentUser.photoURL || flat,
          });
        } else {
          console.log("No user document found");
          setUser({
            name: currentUser.displayName || "Guest User",
            email: currentUser.email,
            profilePhotoUrl: flat,
          });
        }
      } else {
        setUser(null); // Clear user data if not authenticated
      }
      setLoading(false); // Update loading state
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div className="dashboardContainer">
      <div className="profileSection">
        <img
          src={user.profilePhotoUrl}
          alt="Profile"
          className="profileImage"
        />
        <div className="profileDetails">
          <h2 className="profileName">{user.name}</h2>
          <strong className="profileEmail">{user.email}</strong>
           <div className="role">
        {user.role === "admin" && <div><strong>Account Type:</strong> Admin</div>}
        {user.role === "vendor" && <div>You have vendor privileges.</div>}
        {user.role === "customer" && (
          <div>You do not have vendor privileges.</div>
        )}
      </div>
          <Link to="/profile" className="profileButton" onClick={closeMenu}>
            {" "}
            {/* Close menu on click */}
            Profile
          </Link>
        </div>
      </div>
     
    </div>
  );
}

export default MiniDash;
