// src/App.js
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import GetAuth from "./authentication/GetAuth";
import GetDash from "./authentication/GetDash";
import Loading from "./components/loading";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user is not null, user is authenticated
      setIsAuthenticated(!!user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return (
    <div>
       <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            zIndex:  100000002,
          },
        }}
      />
      <Header />
      <div className="top bottom">
        {isAuthenticated ? <GetDash /> : <GetAuth />}
      </div>
      <Footer />
     
    </div>
  );
}

export default App;
