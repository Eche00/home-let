import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storageF } from "./firebase";

// handling saving image to firebase storage
const storageImage = async (file) => {
  return new Promise((resolve, reject) => {
    const storage = storageF;
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`upload ${progress}% done`);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default storageImage;
