import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import CreateProperty from './CreateProperty';
import NotFound from './NotFound';
import Loading from '../components/loading';

const AddProperty = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          console.error("No such document!");
        }
      }
      // Set loading to false after fetching the data
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) {
    // Display loading message
    return <Loading />;
  }

  return (
    <div>
      {(userRole === 'admin' || userRole === 'vendor') ? <CreateProperty /> : <NotFound />}
    </div>
  );
};

export default AddProperty;
