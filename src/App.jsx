// src/App.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import GetAuth from "./authentication/GetAuth";
import GetDash from "./authentication/GetDash";
import Loading from "./components/loading";

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

      {
        isAuthenticated
          // if user is authenticated show GetDash, else GetAuth
          ? <GetDash />
          : <GetAuth />
      }
    </div>
  );
}

export default App;
