import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import GetUser from "./GetUser";
import NotFound from "../pages/NotFound";
import Login from "./login";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProductList from "../pages/ProductList";
import Terms from "../pages/Terms";
import Services from "../pages/Services";
import PropertyPreview from "../pages/PropertyPreview";
import AddProperty from "../pages/AddProperty";
import Sidebar from "../dashboards/Sidebar";
import VendorProperties from "../pages/VendorProperties";
import Dashboard from "../dashboards/Dashboard";
import Profile from "../pages/Profile";
import Deposit from "../pages/Deposit";
import Inspection from "../pages/Inspection";
import Settings from "../pages/Settings";
import "../styles/GetDash.css";
import History from "../dashboards/MiniDash";
import Withdrawal from "../pages/Widthdrawal";

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
      <div className="head">
        {user && (
          <div>
            <Sidebar />
          </div>
        )}
      </div>
      <div className="vendorRoutes">
        <Routes>
          {/* Define all the routes here */}
          <Route path="/dashboard" element={<GetUser />} />
          <Route path="/add" element={<AddProperty />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/properties" element={<ProductList />} />
          <Route path="/preview/:propertyId" element={<PropertyPreview />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/our-services" element={<Services />} />
          {/* eche added routes  */}
          <Route path="/vendorproperties" element={<VendorProperties />} />
          <Route index element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          <Route path="/history" element={<History />} />
          <Route path="/inspection" element={<Inspection />} />
          <Route path="/settings" element={<Settings />} />

          {/* Redirect from "/" to "/dashboard" */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default GetDash;
