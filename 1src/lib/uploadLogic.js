import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storageF } from "./firebase";

/**
 * Uploads an image file to Firebase Storage.
 * Handles image upload from mobile or web (e.g., Netlify).
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - Resolves to the download URL of the uploaded image
 */
const storageImage = async (file) => {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided.");
  }

  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const sanitizedFilename = file.name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
      const fileName = `uploads/${timestamp}_${sanitizedFilename}`;

      const storageRef = ref(storageF, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(new Error("Failed to upload image. Please try again."));
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((err) => {
              console.error("Failed to get download URL:", err);
              reject(new Error("Could not retrieve image URL."));
            });
        }
      );
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      reject(new Error("Unexpected error during image upload."));
    }
  });
};

export default storageImage;
