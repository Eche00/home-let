import { collection, doc, setDoc } from "firebase/firestore";
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
