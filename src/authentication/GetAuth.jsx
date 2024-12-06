import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './register';
import Home from '../pages/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ForgotPassword from './ForgotPassword';
import About from '../pages/About';
import Contact from '../pages/Contact';
import ProductList from '../pages/ProductList';
import Terms from '../pages/Terms';
import Services from '../pages/Services';
import PropertyPreview from '../pages/PropertyPreview';

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

  

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/properties" element={<ProductList />} />
            <Route path="/preview/:propertyId" element={<PropertyPreview />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/our-services" element={<Services />} />
            {/* Redirect to login if no match */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default GetAuth;
