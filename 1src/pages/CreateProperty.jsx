import React, { useEffect, useRef, useState } from "react";
import {
  handleCreateProperty,
  handleImageUpload,
  handleVideoUpload,
} from "../lib/createPropertyLogic";
import { useNavigate } from "react-router-dom";
import "../styles/CreateProperty.css";
import { auth, db } from "../lib/firebase";
import Loading from "../components/uploadLoading";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";

function CreateProperty() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoUrlPreview, setVideoUrlPreview] = useState(null);
  const [imageLimitError, setImageLimitError] = useState(false);
  const [creator, setCreator] = useState();

  const navigate = useNavigate();
  const imageRef = useRef();

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
    price: "",
    bedrooms: 1,
    bathrooms: 1,
    video: { file: "", url: "" },
    creatorName: "",
    createdAt: serverTimestamp(),
  });

  // For setting creator name
  useEffect(() => {
    // handle authentication change and getting user credential for form submission
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        setCreator({
          name: userData.fullName || "Guest User",
          email: userData.email || currentUser.email,
        });

        // Update formData to include the user ID in the video field
        setFormData((prevData) => ({
          ...prevData,
          video: { file: currentUser.uid, url: "" }, // Replace null with user ID
        }));
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setError(false);

    // Handle video selection
    if (e.target.id === "video") {
      const videoFile = e.target.files[0];

      // Ensure the selected file is a valid video format
      if (videoFile && videoFile.type.startsWith("video/")) {
        setVideoUrl(videoFile);
        setVideoUrlPreview(URL.createObjectURL(videoFile));
      } else {
        console.error("Invalid video format");
        setVideoUrl(null);
        setVideoUrlPreview(null);
      }
    }
    setFormData({ ...formData, creatorName: creator.name });

    // Handle property type (Rent or Sale)
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      [
        "title",
        "address",
        "state",
        "city",
        "houseType",
        "price",
        "amenities",
        "description",
        "type",
        "price",
        "bedrooms",
        "bathrooms",
      ].includes(e.target.id)
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setImageLimitError(true);
      setFiles(selectedFiles.slice(0, 3)); // Limit to 3 images
    } else {
      setImageLimitError(false);
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (files.length === 0) {
      setError(true);
      console.error("No images selected");
      setLoading(false);
      return;
    }

    try {
      // Upload images
      let updatedFormData = await handleImageUpload(files, formData);

      // Upload video after image upload
      updatedFormData = await handleVideoUpload(videoUrl, updatedFormData);

      // Create property in Firebase
      await handleCreateProperty(updatedFormData);

      navigate("/dashboard"); // Redirect after success
    } catch (error) {
      setError(true);
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <div className="create-container">
            <form onSubmit={handleSubmit} className="createPropertyForm">
              <h2 className="msg">Fill all input</h2>
              <span className="line"></span>

              <div className="formContainer">
                {/* Image Upload */}
                <div className="addImg">
                  <label
                    className="createPropertyLabels"
                    htmlFor="images"
                    ref={imageRef}>
                    <span className="plus">+</span>
                    {files.length > 0
                      ? ` ${files.length}/3 Files selected`
                      : "  Select 3 Images for Preview"}
                  </label>
                  <input
                    id="images"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    type="file"
                  />
                </div>

                {/* If picture files are selected, Display list of selected files */}
                {files.length > 0 && files.length <= 3 ? (
                  <ul>
                    {files.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                ) : files.length > 3 ? null : null}

                {/* If Image is more than 3, show limit error */}
                {imageLimitError && (
                  <div className="errorMessage">
                    You can only select 3 images.
                  </div>
                )}

                <div
                  // Start the cover for the form
                  className="propertyForm">
                  {/* Property Title */}
                  <section>
                    <label className="createPropertyLabels" htmlFor="title">
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      id="title"
                      placeholder="New 2 Bedroom Duplex with City Views"
                      onChange={handleChange}
                      value={formData.title}
                      className="propertyFormInput"
                    />
                  </section>

                  {/* Address, State, City */}
                  <div className="addressStateCity">
                    {/* Address */}
                    <section className="address">
                      <label className="createPropertyLabels" htmlFor="address">
                        Address
                      </label>
                      <input
                        required
                        type="text"
                        id="address"
                        placeholder="123 Maple Leaf Street"
                        onChange={handleChange}
                        value={formData.address}
                        className="propertyFormInput"
                      />
                    </section>

                    {/* City */}
                    <section className="city">
                      <label className="createPropertyLabels" htmlFor="city">
                        City
                      </label>
                      <input
                        required
                        type="text"
                        id="city"
                        placeholder=" Example City"
                        onChange={handleChange}
                        value={formData.city}
                        className="propertyFormInput"
                      />
                    </section>

                    {/* State */}
                    <section className="state">
                      <label className="createPropertyLabels" htmlFor="state">
                        State
                      </label>
                      <select
                        required
                        id="state"
                        onChange={handleChange}
                        value={formData.state}>
                        <option value="" disabled>
                          Select State
                        </option>
                        <option value="Abia">Abia</option>
                        <option value="Adamawa">Adamawa</option>
                        <option value="Akwa Ibom">Akwa Ibom</option>
                        <option value="Anambra">Anambra</option>
                        <option value="Bauchi">Bauchi</option>
                        <option value="Bayelsa">Bayelsa</option>
                        <option value="Benue">Benue</option>
                        <option value="Borno">Borno</option>
                        <option value="Cross River">Cross River</option>
                        <option value="Delta">Delta</option>
                        <option value="Ebonyi">Ebonyi</option>
                        <option value="Edo">Edo</option>
                        <option value="Ekiti">Ekiti</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Gombe">Gombe</option>
                        <option value="Imo">Imo</option>
                        <option value="Jigawa">Jigawa</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Kano">Kano</option>
                        <option value="Katsina">Katsina</option>
                        <option value="Kebbi">Kebbi</option>
                        <option value="Kogi">Kogi</option>
                        <option value="Kwara">Kwara</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Nasarawa">Nasarawa</option>
                        <option value="Niger">Niger</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Ondo">Ondo</option>
                        <option value="Osun">Osun</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Plateau">Plateau</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Sokoto">Sokoto</option>
                        <option value="Taraba">Taraba</option>
                        <option value="Yobe">Yobe</option>
                        <option value="Zamfara">Zamfara</option>
                        <option value="FCT">
                          Federal Capital Territory (FCT)
                        </option>
                      </select>
                    </section>
                  </div>

                  <div className="addressStateCity">
                    {/* House Type */}
                    <section className="state">
                      <label
                        className="createPropertyLabels"
                        htmlFor="houseType">
                        House Type
                      </label>
                      <select
                        id="houseType"
                        value={formData.houseType}
                        onChange={handleChange}
                        className="propertyFormInput"
                        required>
                        <option value="" disabled>
                          Select House Type
                        </option>
                        <option value="duplex">Duplex</option>
                        <option value="selfContain">Self Contain</option>
                        <option value="bungalow">Bungalow</option>
                        <option value="flat">Flat</option>
                        <option value="hostel">Hostel</option>
                      </select>
                    </section>

                    {/* Bedrooms */}
                    <section className="state">
                      <label
                        className="createPropertyLabels"
                        htmlFor="bedrooms">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        id="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="propertyFormInput"
                      />
                    </section>

                    {/* Bathrooms */}
                    <section className="state">
                      <label
                        className="createPropertyLabels"
                        htmlFor="bathrooms">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="propertyFormInput"
                      />
                    </section>

                    {/* Property Type (Rent or Sale) */}
                    <section className="state">
                      <label
                        className="createPropertyLabels"
                        htmlFor="propertyType">
                        Property Type
                      </label>
                      <select
                        id="propertyType"
                        value={formData.type}
                        onChange={handleChange}
                        className="propertyFormInput"
                        required>
                        <option value="" disabled>
                          Select Property Type
                        </option>
                        <option value="rent">Rent</option>
                        <option value="sale">Sale</option>
                        <option value="sale">Shortlet</option>
                      </select>
                    </section>
                  </div>

                  {/* Description */}
                  <section className="formDescription">
                    <label
                      className="createPropertyLabels"
                      htmlFor="description">
                      Description
                    </label>
                    <textarea
                      required
                      id="description"
                      placeholder="Property description: Give a detailed description of the property including the upsides and downsides."
                      onChange={handleChange}
                      value={formData.description}
                    />
                  </section>

                  <div className="addressStateCity">
                    {/* price */}
                    <section className="state">
                      <label className="createPropertyLabels" htmlFor="price">
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="propertyFormInput"
                      />
                    </section>

                    {/* Amenities */}
                    <section className="state">
                      <label
                        className="createPropertyLabels"
                        htmlFor="amenities">
                        Amenities
                      </label>
                      <input
                        type="text"
                        id="amenities"
                        placeholder="Pool, Gym, etc."
                        onChange={handleChange}
                        value={formData.amenities}
                        className="propertyFormInput"
                      />
                    </section>
                  </div>

                  {/* Video Upload */}
                  <div className="addVideo">
                    <label className="createPropertyLabels" htmlFor="video">
                      <span className="plus">+</span>
                      {videoUrl
                        ? ` Video selected, click to change`
                        : " Click to add video"}
                    </label>
                    <input
                      id="video"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={handleChange}
                      type="file"
                    />
                  </div>
                  {videoUrlPreview && (
                    <video className="videoPreview" controls>
                      <source src={videoUrlPreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <p className="errorMessage">
                    Please fill out all fields correctly
                  </p>
                )}

                {/* Submit Button */}
                {loading ? (
                  <div className="load">
                    {" "}
                    <Loading />
                  </div>
                ) : (
                  <button type="submit" className="propertySubmitButton">
                    Upload Property
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CreateProperty;
