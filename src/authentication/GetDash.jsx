import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Route, Routes, Navigate } from 'react-router-dom';
import GetUser from './GetUser';
import NotFound from '../pages/NotFound';
import Login from './login';

const GetDash = () => {
    const auth = getAuth();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
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

    if (!user) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <p>Hello, {user.displayName || user.email}!</p>
            <button onClick={handleLogout}>Logout</button>
            <Routes>
                <Route path="/" element={<GetUser />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<GetUser />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default GetDash;
