import React, { useEffect, useState } from 'react';
import CustomerDash from '../dashboards/CustomerDash';
import AdminDash from '../dashboards/AdminDash';
import VendorDash from '../dashboards/VendorDash';
import { auth, db } from '../lib/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import Loading from '../components/loading';

const GetUser = () => {
    const [userRole, setUserRole] = useState(null); 
    const [userGroup, setUserGroup] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUserRoleAndGroup = async () => {
            try {
                const user = auth.currentUser; // Get the authenticated user
                if (user) {
                    
                    // Use doc() and getDoc() from Firestore to fetch user document
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        
                        // Make sure there's a 'role' and 'group' field in the user document
                        if (userData.role) {
                            setUserRole(userData.role); // Set the user role
                        } else {
                            console.error('Role field not found in user document');
                        }

                        if (userData.group) {
                            setUserGroup(userData.group); // Set the user group
                        } else {
                            console.error('Group field not found in user document');
                        }
                    } else {
                        console.log('No such user document!');
                    }
                } else {
                    console.log('No user is logged in');
                }
            } catch (error) {
                console.error('Error fetching user role and group: ', error);
            } finally {
                setLoading(false); // Stop the loading state
            }
        };
    
        fetchUserRoleAndGroup();
    }, []);
    

    // if (loading) {
    //     return <Loading />; 
    // }

    if (!userRole) {
        return <div>User role not found</div>; 
    }


    return (
        <div>
            <div>User Role: {userRole}</div>
            {userGroup && <div>User Group Status: {userGroup}</div>} 

            {/* Conditional rendering for Dashboard based on user role */}
            {userRole === 'customer' && <CustomerDash />}
            {userRole === 'vendor' && <VendorDash />}
            {userRole === 'admin' && <AdminDash />}
        </div>
    );
};

export default GetUser;
