import React, { useEffect, useState } from "react";
import "../styles/Inspection.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import firebase from "firebase/compat/app";

function Inspection() {
  const currentUser = auth.currentUser;

  const [inspections, setInspections] = useState([]);
  const [properties, setProperties] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [vendor, setVendor] = useState(false);
  const [client, setClient] = useState(false);

  useEffect(() => {
    // Fetch inspections in real-time
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

    // Fetch properties
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

    return () => unsubscribeInspections(); // Clean up listener
  }, []);

  // Matching inspections with properties loinked to it
  useEffect(() => {
    const matched = inspections.map((inspection) => {
      const matchingProperty = properties.find(
        (property) => property.id === inspection.id
      );
      return { ...inspection, property: matchingProperty || null };
    });
    setMatchedData(matched);
  }, [inspections, properties]);

  // getting inspections based on user role == vendor
  useEffect(() => {
    const mappedVendorData = matchedData.map((vendor) => {
      return vendor;
    });
    const vendorData = mappedVendorData.filter((vendor) =>
      vendor.id.endsWith(currentUser.uid)
    );
    // Set vendor to true only if vendorProp has matches
    if (vendorData.length > 0) {
      setVendor(true);
    } else {
      setVendor(false);
    }
  }, [matchedData, currentUser.uid]);

  // getting inspections based on user role == client
  useEffect(() => {
    // Check if the current user is a client
    const clientData = matchedData.filter(
      (inspect) => inspect.userReqId === currentUser.uid
    );
    setClient(clientData.length > 0);
  }, [matchedData, currentUser.uid]);

  // Handling accept functionality based on the indpection id and time submitted(time submitted prevents an error)
  const handleAccept = async (inspectionId, submittedAt) => {
    try {
      console.log("Inspection ID:", inspectionId);
      // Query the collection to find the document with the matching "id" field
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
      // Loop through matching documents (there should only be one)
      querySnapshot.forEach(async (docSnapshot) => {
        console.log("Document found:", docSnapshot.id);
        // Update the status field
        const docRef = docSnapshot.ref;
        await updateDoc(docRef, { "data.status": "Accepted" });
        console.log(`Inspection ${inspectionId} status updated to Accepted.`);
      });
    } catch (error) {
      console.error("Error accepting inspection:", error);
    }
  };

  // Handling reject functionality based on the indpection id and time submitted(time submitted prevents an error)
  const handleReject = async (inspectionId, submittedAt) => {
    try {
      console.log("Inspection ID:", inspectionId);
      // Query the collection to find the document with the matching "id" field
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
      // Loop through matching documents (there should only be one)
      querySnapshot.forEach(async (docSnapshot) => {
        console.log("Document found:", docSnapshot.id);
        // Update the status field
        const docRef = docSnapshot.ref;
        await updateDoc(docRef, { "data.status": "Rejected" });
        console.log(`Inspection ${inspectionId} status updated to Rejected.`);
      });
    } catch (error) {
      console.error("Error accepting inspection:", error);
    }
  };

  return (
    <div className="inspectionC">
      <h3 className="inspectionH">Property Inspections</h3>

      {vendor && matchedData.length > 0
        ? matchedData.map((inspect, index) => (
            <div className="inpectionContainer" key={index}>
              <div className="inpectionsubContainer">
                {/* Schedule Section */}
                <section className="inspectorPropertySchedule">
                  <div className="inspectionPropertyAddressContainer">
                    <p className="place">DATE</p>
                    <p className="scheduleDetail">
                      {inspect.date || "No date available"}
                    </p>
                    <p className="place">TIME</p>
                    <p className="scheduleDetail">
                      {inspect.time || "No time available"}
                    </p>
                  </div>
                </section>

                {/* Place Section */}
                <section className="inspectorPropertySchedule">
                  <span>i</span>
                  <div className="inspectionPropertyAddressContainer">
                    <p className="place">PLACE</p>
                    <p className="placeB">
                      {inspect.property?.address || "Address not provided"}
                    </p>
                    <p className="placeC">
                      {inspect.property?.notes ||
                        "Please note that no harmful substance should be brought to this inspection."}
                    </p>
                    {vendor && inspect.status === "Pending" ? (
                      <div className="vButtonContainer">
                        <button
                          className=" accept"
                          onClick={() =>
                            handleAccept(inspect.id, inspect.submittedAt)
                          }>
                          Accept
                        </button>
                        <button
                          className=" reject"
                          onClick={() =>
                            handleReject(inspect.id, inspect.submittedAt)
                          }>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="vButtonContainer">
                        <button
                          className={` ${
                            (inspect.status === "Pending" && "pending") ||
                            (inspect.status === "Rejected" && "reject") ||
                            (inspect.status === "Accepted" && "accept")
                          } 
                       
                      `}>
                          {inspect.status}
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Property Section */}
                <section className="inspectorPropertyDetails">
                  <img
                    className="inspectorPropertyImage"
                    src={inspect.property?.imageUrls[0] || "/default-image.png"}
                    alt="Property"
                  />
                  <p className="inspectorPropertyTitle">
                    {inspect.property?.title || "Property title unavailable"}
                  </p>
                </section>
              </div>
            </div>
          ))
        : client &&
          matchedData.length > 0 &&
          matchedData
            .filter((inspect) => inspect.userReqId === currentUser.uid) // Client filtering
            .map((inspect, index) => (
              <div className="inpectionContainer" key={index}>
                <div className="inpectionsubContainer">
                  {/* Schedule Section */}
                  <section className="inspectorPropertySchedule">
                    <div className="inspectionPropertyAddressContainer">
                      <p className="place">DATE</p>
                      <p className="scheduleDetail">
                        {inspect.date || "No date available"}
                      </p>
                      <p className="place">TIME</p>
                      <p className="scheduleDetail">
                        {inspect.time || "No time available"}
                      </p>
                    </div>
                  </section>

                  {/* Place Section */}
                  <section className="inspectorPropertySchedule">
                    <span>i</span>
                    <div className="inspectionPropertyAddressContainer">
                      <p className="place">PLACE</p>
                      <p className="placeB">
                        {inspect.property?.address || "Address not provided"}
                      </p>
                      <p className="placeC">
                        {inspect.property?.notes ||
                          "Please note that no harmful substance should be brought to this inspection."}
                      </p>
                      {client && (
                        <div className="vButtonContainer">
                          <button
                            className={` ${
                              (inspect.status === "Pending" && "pending") ||
                              (inspect.status === "Rejected" && "reject") ||
                              (inspect.status === "Accepted" && "accept")
                            } 
                             
                            `}>
                            {inspect.status}
                          </button>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Property Section */}
                  <section className="inspectorPropertyDetails">
                    <img
                      className="inspectorPropertyImage"
                      src={
                        inspect.property?.imageUrls[0] || "/default-image.png"
                      }
                      alt="Property"
                    />
                    <p className="inspectorPropertyTitle">
                      {inspect.property?.title || "Property title unavailable"}
                    </p>
                  </section>
                </div>
              </div>
            ))}
    </div>
  );
}

export default Inspection;
