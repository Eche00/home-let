import React, { useEffect, useRef, useState } from "react";
import "../styles/CreateListing.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storageF } from "../lib/firebase";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";

function CreateListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]); // state to handle image selection
  const [imageUploadError, setImageUploadError] = useState(false); // state to manage image error
  const [uploading, setUploading] = useState(false); // state to manage image loading
  const [error, setError] = useState(false); // state to manage image error
  const [success, setSuccess] = useState(false); // state to manage form submission success

  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    address: "",
    state: "",
    city: "",
    houseType: "",
    amenities: "",
    description: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
  });

  // Fetching logged in user data
  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate("/*");
    }
  }, [navigate]);

  const imageRef = useRef(); // handling hidden file input

  // handling image upload to firebase
  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 4) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed: " + err);
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 3 images per Property");
      setUploading(false);
    }
  };

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

  // handling removing image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // handling getting property form inputs
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  // handling property form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const propertyDataDoc = new Date().getTime() + "-" + user.uid;

    const propertyDataRef = doc(
      collection(db, "propertyData"),
      propertyDataDoc
    );

    setDoc(propertyDataRef, { data: formData })
      .then(() => {
        console.log("Property Data uploaded successfully");
        setFormData({
          imageUrls: [],
          title: "",
          address: "",
          state: "",
          city: "",
          houseType: "",
          amenities: "",
          description: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
        });
        setUploading(false);
        setSuccess(true);
        setError(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error uploading property data:", error);
        setError(true);
        setUploading(false);
        setSuccess(false);
      });
  };

  return (
    <div>
      {user ? (
        <>
          {/* container  */}
          <div className="add-container">
            {/* sub container(uploaded img part) */}
            <div className="sub-container">
              <h1 className="h1"> Property Image</h1>
              <div className="createDetail">
                <div className="imageContainer">
                  {formData.imageUrls.length > 0 &&
                    formData.imageUrls.map((url, index) => (
                      <div key={index} className="propertyImg">
                        <img src={url} alt="property img" className="img" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="deleteImg">
                          X
                        </button>
                      </div>
                    ))}
                  <p className=" imageError">
                    {imageUploadError && `! ${imageUploadError}`}
                  </p>
                </div>
              </div>
            </div>
            {/* form */}
            <form onSubmit={handleSubmit} className="form">
              <p className="msg">Fill all input</p>
              <span className="line"></span>
              <div className="formContainer">
                {/* upload img section  */}
                <div className="addImg">
                  <label htmlFor="images" ref={imageRef} className="label">
                    <span className="plus">+</span>
                    {files.length > 0
                      ? ` ${files.length} ${files.length === 1 ? "Image" : "Images"
                      } selected`
                      : " Click to add image"}
                  </label>
                  <input
                  className="input"
                    id="images"
                    accept="images/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => setFiles(e.target.files)}
                    type="file"
                  />
                  <button
                    onClick={handleImageUpload}
                    disabled={uploading}
                    type="button"
                    className="custom-button">
                    {uploading ? "loading.." : "Upload"}
                  </button>
                </div>
                {/* title section  */}
                <div className="section">
                  <label htmlFor="title">Title</label>
                  <input
                   className="input"
                    required
                    type="text"
                    id="title"
                    placeholder="New 2 Bedroom Duplex with astonishing City Views"
                    onChange={handleChange}
                    value={formData.title}
                  />
                </div>
                {/* address section  */}
                <div className="section">
                  <label htmlFor="address">Address</label>
                  <input
                   className="input"
                    required
                    type="text"
                    id="address"
                    placeholder="Nnamdi Azikiwe street"
                    onChange={handleChange}
                    value={formData.address}
                  />
                  <div className="address">
                    {" "}
                    <input
                      required
                      className="addressL"
                      type="text"
                      id="state"
                      placeholder="Anambra"
                      onChange={handleChange}
                      value={formData.state}
                    />
                    <input
                      required
                      className="addressL"
                      type="text"
                      id="city"
                      onChange={handleChange}
                      placeholder="Nnewi"
                      value={formData.city}
                    />
                  </div>
                </div>
                {/* House type section  */}
                <div className="section">
                  <label htmlFor="type">Type</label>
                  <input
                   className="input"
                    required
                    type="text"
                    id="houseType"
                    placeholder="Duplex"
                    onChange={handleChange}
                    value={formData.houseType}
                  />
                </div>
                {/* amenities section  */}
                <div className="section">
                  <label htmlFor="amenities">Amenities</label>
                  <input
                   className="input"
                    required
                    type="text"
                    id="amenities"
                    placeholder="Balcony, 
                Parking,
                Swimming Pool  etc.."
                    onChange={handleChange}
                    value={formData.amenities}
                  />
                </div>
                {/* description section  */}
                <div className="section">
                  <label htmlFor="description">Description</label>
                  <textarea
                    required
                     className="input textarea"
                    name=""
                    id="description"
                    cols="30"
                    rows="7"
                    onChange={handleChange}
                    value={formData.description}
                    placeholder="A beautiful 2-bedroom, 3-bathroom all in suite duplex located in the reare part of the city. With stunning views , spacious living areas, and and well  furnished..."></textarea>
                </div>
                {/* checkboxes */}
                <div className="boxContainer">
                  <div className="eachBox">
                    <input
                      type="checkbox"
                      className="box"
                      name=""
                      id="sale"
                      onChange={handleChange}
                      checked={formData.type === "sale"}
                    />
                    <span>Sale</span>
                  </div>

                  <div className="eachBox">
                    <input
                      type="checkbox"
                      className="box"
                      name=""
                      id="rent"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                    />
                    <span>Rent</span>
                  </div>

                  {/* rooms */}
                  <div className="boxContainer">
                    <div className="eachBox">
                      <input
                        type="number"
                        id="bedrooms"
                        min={"1"}
                        max={"10"}
                        className="boxb"
                        required
                        onChange={handleChange}
                        value={formData.bedrooms}
                      />
                      <p>: Beds</p>
                    </div>
                    <div className="eachBox">
                      <input
                        type="number"
                        id="bathrooms"
                        min={"1"}
                        max={"10"}
                        className="boxb"
                        required
                        onChange={handleChange}
                        value={formData.bathrooms}
                      />
                      <p>: Bath</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="submitContainer">
                {success && (
                  <>
                    <p className="success">
                      Success{" "}
                      <span className="redirect">
                        {" "}
                        This page would redirect in 3s...
                      </span>
                    </p>
                  </>
                )}
                {error && (
                  <>
                    <p className="error">
                      Error uploading property{" "}
                      <span className="redirect"> Try again</span>
                    </p>
                  </>
                )}
                <Link to="/dashboard" className="cancel">
                  Cancel
                </Link>
                <button>Submit</button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}

export default CreateListing;
