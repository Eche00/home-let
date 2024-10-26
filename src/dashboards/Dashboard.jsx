import React, { useEffect, useState } from "react";
import Wallet from "./DashboardContent/Wallet";
import History from "./MiniDash";
import MyRecents from "./DashboardContent/MyRecents";
import RecentProperties from "./DashboardContent/RecentProperties";
import "../styles/Dashboard.css";
import Loading from "../components/loading";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoleAndGroup = async () => {
      try {
        const user = auth.currentUser; // Get the authenticated user
        if (user) {
          // Use doc() and getDoc() from Firestore to fetch user document
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            // Make sure there's a 'role' and 'group' field in the user document
            if (userData.role) {
              setUserRole(userData.role); // Set the user role
            } else {
              console.error("Role field not found in user document");
            }

            if (userData.group) {
              setUserGroup(userData.group); // Set the user group
            } else {
              console.error("Group field not found in user document");
            }
          } else {
            console.log("No such user document!");
          }
        } else {
          console.log("No user is logged in");
        }
      } catch (error) {
        console.error("Error fetching user role and group: ", error);
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchUserRoleAndGroup();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="Vendor-Dashboard-Container">
      <div className="walletContainer">
        <Wallet />
      </div>
      <div className="first-Dashboard">
        <div className="historyContainer">
          <History />
        </div>
        <div className="myRecents">
            {userRole === "vendor" ? (
              // vendor dashboard section
             
                <MyRecents />
              
            ) : (
              // customer dashboard section
              <>add yours here with same classname as mine</>
            )}
        </div>
      </div>
      <RecentProperties />
    </div>
  );
};

export default Dashboard;
