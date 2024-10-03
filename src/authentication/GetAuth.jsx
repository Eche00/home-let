import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import GetUser from './GetUser';
import Home from '../pages/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const GetAuth = () => {
    const [user, setUser] = React.useState(null);
    const auth = getAuth();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // User is signed in
            } else {
                setUser(null); // No user is signed in
            }
        });

        return () => unsubscribe();
    }, [auth]);

    if (user) {
        // If the user is authenticated, redirect to GetUser
        return <Navigate to="/user" />;
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<GetUser />} />
            {/* Redirect to login if no match */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default GetAuth;
