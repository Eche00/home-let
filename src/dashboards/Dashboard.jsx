import React, { useEffect, useState } from "react";
import Wallet from "./DashboardContent/Wallet";
import MiniDash from "./MiniDash";
import Properties from "../components/Properties";
import "../styles/Dashboard.css";
import Loading from "../components/loading";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Use doc() and getDoc() from Firestore to fetch user document
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.log("No such user document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="Vendor-Dashboard-Container">
      <div className="walletContainer">
        <div className="wallet">
          <Wallet />
        </div>
        <div className="mini-profile">
          {" "}
          <MiniDash />
        </div>
      </div>
      <Properties />
    </div>
  );
};

export default Dashboard;
