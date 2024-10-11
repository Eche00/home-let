// src/App.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import GetAuth from "./authentication/GetAuth";
import GetDash from "./authentication/GetDash";
import Loading from "./components/loading";
import Footer from "./components/Footer";
import './styles/Footer.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // If user is not null, user is authenticated
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  if (isAuthenticated === null) {
    return <Loading />;
  }

  return (
    <div>
      <div className="main-content">
        {isAuthenticated ? <GetDash /> : <GetAuth />}
      </div>
      <Footer />
    </div>

  );
}

export default App;
