// Handling inspection uploading

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export const handleMakeInspection = async (formData) => {
  const currentUser = auth.currentUser;

  try {
    const inspectionsDataDoc = new Date().getTime() + currentUser.uid;
    const inspectionsDataRef = doc(
      collection(db, "inspectionData"),
      inspectionsDataDoc
    );
    await setDoc(inspectionsDataRef, { data: formData });
    console.log("Inspection request made successfully");
  } catch (error) {
    console.error("Error making request:", error);
  }
};

// Handling inspection making
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const useFormData = (property, auth) => {
  const currentUser = auth.currentUser;
  const [error, setError] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    time: "",
    date: "",
    id: property.id,
    userReqId: currentUser ? currentUser.uid : "",
    status: "Pending",
    submittedAt: new Date(),
    inspectorName: "",
    inspectorEmail: "",
    createdAt: serverTimestamp(),
  });
  const navigate = useNavigate();
  const [user, setUser] = useState();

  // Checking if there is a user, if not the user gets redirected to login
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      console.log("no current user");
    }

    // handle authentication change and getting user credential for form submission
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        setUser({
          name: userData.fullName || "Guest User",
          email: userData.email || currentUser.email,
        });
      }
      // setLoading(false); // Update loading state
    });
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [currentUser, navigate]);

  // Handling form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(false);
    setLoading(false);
    setFormData({
      ...formData,
      [name]: value,
      inspectorName: user?.name,
      inspectorEmail: user?.email,
      creatorName: property?.creatorName,
    });

    // Formatted Date
    if (name === "date" && value) {
      const dateObject = new Date(value);
      const formatted = dateObject.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setFormattedDate(formatted);
    }

    // Formatted Time
    if (name === "time" && value) {
      const [hours, minutes] = value.split(":");
      let formatted = "";
      const hoursInt = parseInt(hours);

      if (hoursInt === 0) {
        formatted = `12:${minutes} AM`;
      } else if (hoursInt < 12) {
        formatted = `${hoursInt}:${minutes} AM`;
      } else if (hoursInt === 12) {
        formatted = `12:${minutes} PM`;
      } else {
        formatted = `${hoursInt - 12}:${minutes} PM`;
      }

      setFormattedTime(formatted);
    }
  };
  // Function to handle deleting a property
  const handleDeleteProperty = async (propertyId) => {
    try {
      const propertyRef = doc(db, "propertyData", propertyId);

      // Deleting the document with the given propertyId
      await deleteDoc(propertyRef);
      navigate("/");
      console.log("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return {
    formData,
    setFormData,
    error,
    setError,
    formattedDate,
    formattedTime,
    handleChange,
    loading,
    setLoading,
    handleDeleteProperty,
  };
};

export default useFormData;
