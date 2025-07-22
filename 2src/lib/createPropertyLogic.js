import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import storageImage from "./uploadLogic";
import storageVideo from "./UploadVideoLogic";

// Function to handle creating a property
export const handleCreateProperty = async (formData) => {
  const currentUser = auth.currentUser;

  try {
    const propertyDataDoc = new Date().getTime() + "-" + currentUser.uid;

    const propertyDataRef = doc(
      collection(db, "propertyData"),
      propertyDataDoc
    );

    await setDoc(propertyDataRef, { data: formData });
    console.log("Property Data uploaded successfully");
  } catch (error) {
    console.error("Error uploading property data:", error);
  }
};

// Function to handle image uploads
export const handleImageUpload = async (files, formData) => {
  try {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storageImage(files[i]));
    }

    const urls = await Promise.all(promises);
    formData.imageUrls.push(...urls);
    return formData;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// Function to handle video upload
export const handleVideoUpload = async (videoUrl, formData) => {
  try {
    const url = await storageVideo(videoUrl);
    formData.video.url = url;
    return formData;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
