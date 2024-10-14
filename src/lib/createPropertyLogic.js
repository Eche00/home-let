// regLogic to handle the create post
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const handleCreateProperty = async (formData) => {
  const currentUser = auth.currentUser;

  try {
    //setting unique doc for each property to be time property was added to db  plus user id
    const propertyDataDoc = new Date().getTime() + "-" + currentUser.uid;

    // Create database and adding property Data
    const propertyDataRef = doc(
      collection(db, "propertyData"),
      propertyDataDoc
    );

    setDoc(propertyDataRef, { data: formData }).then(() => {
      console.log("Property Data uploaded successfully");
    });
  } catch (error) {}
};
