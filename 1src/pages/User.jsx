import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth";
import flat from "../assets/fiat.png";
import "../styles/Profile.css";
import Loading from "../components/loading";

const User = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userSnap = await getDoc(doc(db, "users", userId));
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUser(data);
                    setRole(data.role || "customer");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkAdmin = async () => {
            const current = getAuth().currentUser;
            if (current) {
                const snap = await getDoc(doc(db, "users", current.uid));
                if (snap.exists() && snap.data().role === "admin") {
                    setIsAdmin(true);
                }
            }
        };

        fetchUser();
        checkAdmin();
    }, [userId]);

    const handleRoleChange = (e) => setRole(e.target.value);

    const handleRoleUpdate = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role });
            setUser((prev) => ({ ...prev, role }));
            setSuccessMessage("Role updated!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error updating role:", err);
            setSuccessMessage("Update failed.");
        }
    };

    if (loading) return <Loading />;

    const imgSrc = user?.profileImage || flat;

    return (
        <div className="profile-container">
             <div className="profile-wrapper">
                <div className="profile-details">
                    <div className="personal-info">
                        <h2>User Profile</h2>
                    </div>
    
                    <div className="profile-summary">
                        <div className="profile-summary-content">
                            <img className="profile-summary-image" src={imgSrc} alt="User DP" />
                            <h1 className="profile-summary-name">{user?.fullName || "No Name"}</h1>
                            <p className="profile-summary-balance">
                                <strong>Balance:</strong> ₦{user?.balance?.toLocaleString() || "0"}
                            </p>
                        </div>
                    </div>
    
    
                    <div className="profile-section">
                        <div className="contact-socials-container">
                            {/* Details grid */}
                            <div className="flex-row">
                                <div className="flex-column">
                                    <label>Full Name</label>
                                    <input type="text" value={user?.fullName} disabled />
                                </div>
                                <div className="flex-column">
                                    <label>Email</label>
                                    <input type="email" value={user?.email} disabled />
                                </div>
                            </div>
    
                            <div className="flex-row">
                                <div className="flex-column">
                                    <label>Phone</label>
                                    <input type="text" value={user?.number || ""} disabled />
                                </div>
                                <div className="flex-column">
                                    <label>State</label>
                                    <input type="text" value={user?.state || ""} disabled />
                                </div>
                            </div>
    
                            <div className="flex-row">
                                <div className="flex-column">
                                    <label>Home Address</label>
                                    <input type="text" value={user?.address || ""} disabled />
                                </div>
                                <div className="flex-column">
                                    <label>Role</label>
                                    {isAdmin ? (
                                        <select value={role} onChange={handleRoleChange}>
                                            <option value="customer">Customer</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <input type="text" value={user?.role} disabled />
                                    )}
                                </div>
                            </div>
    
                            <div className="flex-row">
                                <div className="flex-column">
                                    <label>Bank Name</label>
                                    <input type="text" value={user?.bankName || ""} disabled />
                                </div>
                                <div className="flex-column">
                                    <label>Account Number</label>
                                    <input type="text" value={user?.accountNumber || ""} disabled />
                                </div>
                                <div className="flex-column">
                                    <label>Account Holder</label>
                                    <input type="text" value={user?.accountHolderName || ""} disabled />
                                </div>
                            </div>
    
                            {isAdmin && (
                                <div className="flex-row">
                                    <button onClick={handleRoleUpdate} className="save-button">
                                        Update Role
                                    </button>
                                    {successMessage && (
                                        <p style={{ color: "green", marginLeft: "1rem" }}>
                                            {successMessage}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
           </div>
        </div>
    );
};

export default User;
