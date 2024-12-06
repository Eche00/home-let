import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth"; 
import "../styles/UserProfile.css";
import flat from "../assets/fiat.png";

const User = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    // Fetch user data on component mount or when userId changes
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setRole(userData.role || "Customer");
                } else {
                    console.log("No such document!");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user: ", error);
                setLoading(false);
            }
        };

        // Check if the logged-in user is an admin
        const checkAdminStatus = () => {
            const currentUser = getAuth().currentUser;
            if (currentUser) {
                // Compare the logged-in user's role or user data to determine if they are an admin
                const userRef = doc(db, "users", currentUser.uid);
                getDoc(userRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        const loggedInUserData = docSnap.data();
                        if (loggedInUserData.role === "admin") {
                            // Set admin status if role is admin
                            setIsAdmin(true);
                        }
                    }
                });
            }
        };

        fetchUser();
        checkAdminStatus();
    }, [userId]);

    // Handle role change
    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    // Update user role in Firestore
    const handleRoleUpdate = async () => {
        if (role !== user?.role) {
            try {
                const userDocRef = doc(db, "users", userId);
                await updateDoc(userDocRef, { role: role });
                setUser({ ...user, role: role });
                setSuccessMessage("User role updated successfully!");
            } catch (error) {
                console.error("Error updating role: ", error);
                setSuccessMessage("Failed to update role.");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="row">
                {/* Profile Image Section */}
                <div className="profileCover">
                    <img src={flat} alt="Profile" className="profilePicture" />
                    <div className="heads">
                        <>{user?.fullName}</>
                        <p className="emails">{user?.email}</p>
                    </div>
                </div>

                {/* Second Column for Basic Info */}
                <div>
                    <div className="row infoCover">
                        <div className="col-md-6">
                            <strong>Full Name: </strong>
                            <>{user?.fullName}</>
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <strong>Gender: </strong>
                            <>{user?.gender}</>
                            <hr />
                        </div>
                        {/* Success Message */}
                        {successMessage && (
                            <div className="successMessage">
                                {successMessage}
                            </div>
                        )}

                        {isAdmin && (
                            <div className="col-md-6">
                                <strong>Role: </strong>
                                <select className="select" value={role} onChange={handleRoleChange}>
                                    <option value="customer">Customer</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button className="updateRoleButton" onClick={handleRoleUpdate}>
                                    Update Role
                                </button>
                                <hr />
                            </div>
                        )}

                    </div>

                    {/* User's Address and Other Info */}
                    <div className="row infoCover">
                        <div className="col-md-12">
                            <strong>Home Address: </strong>
                            <>{user?.address || "N/A"}</>
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <strong>State: </strong>
                            <>{user?.state || "N/A"}</>
                            <hr />
                        </div>
                    </div>

                    <div className="row infoCover">
                        <div className="col-md-6">
                            <strong>Phone Number: </strong>
                            {user?.number || "N/A"}
                            <hr />
                        </div>
                        <div className="col-md-6">
                            <strong>Email: </strong>
                            <>{user?.email}</>
                            <hr />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default User;
