import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

// Match inspections with properties and determine user role
export const useInspectionsData = (currentUser) => {
  const [inspections, setInspections] = useState([]);
  const [properties, setProperties] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [vendor, setVendor] = useState(false);
  const [client, setClient] = useState(false);

  useEffect(() => {
    // Fetch inspections data in real-time
    const unsubscribeInspections = onSnapshot(
      collection(db, "inspectionData"),
      (snapshot) => {
        const inspectionData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));
        setInspections(inspectionData);
      }
    );

    // Fetch properties data once
    const fetchProperties = async () => {
      const propertyDataRef = collection(db, "propertyData");
      const querySnapshot = await getDocs(propertyDataRef);
      const propertyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().data,
      }));
      setProperties(propertyData);
    };

    fetchProperties();

    return () => unsubscribeInspections(); // Clean up the listener when the component unmounts
  }, []);

  useEffect(() => {
    // Match inspections with properties and determine user role
    const matched = inspections.map((inspection) => {
      const matchingProperty = properties.find(
        (property) => property.id === inspection.id
      );
      return { ...inspection, property: matchingProperty || null };
    });
    setMatchedData(matched);

    // Check if the current user is a vendor or client
    setVendor(
      matched.some((inspection) => inspection.id.endsWith(currentUser.uid))
    );
    setClient(
      matched.some((inspection) => inspection.userReqId === currentUser.uid)
    );
  }, [inspections, properties, currentUser]);

  return { matchedData, vendor, client };
};

// General handler for accept/reject functionality
export const handleStatusChange = async (inspectionId, submittedAt, status) => {
  try {
    const inspectionsCollectionRef = collection(db, "inspectionData");
    const q = query(
      inspectionsCollectionRef,
      where("data.id", "==", inspectionId),
      where("data.submittedAt", "==", submittedAt)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`No document found with inspectionId: ${inspectionId}`);
      return;
    }

    querySnapshot.forEach(async (docSnapshot) => {
      const docRef = docSnapshot.ref;
      await updateDoc(docRef, { "data.status": status });
      console.log(`Inspection ${inspectionId} status updated to ${status}.`);
    });
  } catch (error) {
    console.error(`Error updating inspection status to ${status}:`, error);
  }
};
