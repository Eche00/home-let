import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import GetUser from './GetUser';
import NotFound from '../pages/NotFound';
import Login from './login';
import CreateListing from '../pages/CreateProperty';

const GetDash = () => {
    const auth = getAuth();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true); // Add a loading state to prevent flickering
    const location = useLocation(); // Get the current location for handling routes properly

    // Listen for changes to the authentication state
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false); // Set loading to false when auth state is known
        });

        return () => unsubscribe();
    }, [auth]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
            })
            .catch((error) => {
                console.error('Error signing out: ', error);
            });
    };

    // Show loading until the auth state is determined
    if (loading) {
        return <p>Loading...</p>;
    }

    // If user is not authenticated, redirect to login page
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return (
        <div>
           <div className='header'>
                <p>Hello, {user.displayName || user.email}!</p>
                <button onClick={handleLogout}>Logout</button>
           </div>
            <Routes>
                {/* Define all the routes here */}
                <Route path="/dashboard" element={<GetUser />} />
                <Route path="/add" element={<CreateListing />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />

                {/* Redirect from "/" to "/dashboard" */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </div>
    );
};

export default GetDash;
