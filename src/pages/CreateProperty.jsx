import React, { useEffect, useRef, useState } from "react";
import { handleCreateProperty } from "../lib/createPropertyLogic";
import { Link, useNavigate } from "react-router-dom";

import "../styles/CreateProperty.css";
import { auth } from "../lib/firebase";
import storageImage from "../lib/uploadLogic";
function CreateProperty() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]); // state to handle image selection
  const [error, setError] = useState(false); // state to manage image error
  const [loading, setLoading] = useState(false); // state to manage form submission loader

  const navigate = useNavigate();
  const imageRef = useRef(); // handling hidden file input

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
    // Get the current user from Firebase
    const currentUser = auth.currentUser;
    // Set the user state if logged in
    setUser(currentUser);
  }, [navigate]);

  // handling getting property form inputs
  const handleChange = (e) => {
    setError(false);

    // handling if the Property is rent or sale
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    // handling the rest of the property property form data
    if (
      e.target.id === "title" ||
      e.target.id === "address" ||
      e.target.id === "state" ||
      e.target.id === "city" ||
      e.target.id === "houseType" ||
      e.target.id === "amenities" ||
      e.target.id === "description" ||
      e.target.type === "number"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if files are selected
    if (files.length <= 0) {
      setError(true);
      console.error("No files selected");
      setLoading(false);
      return;
    }
    try {
      // handling image upload to firebase & property form submission
      if (files.length > 0 && files.length + formData.imageUrls.length < 4) {
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          promises.push(storageImage(files[i]));
        }
        await Promise.all(promises).then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
        });
      }
      // Submit property form & navigate to preview
      await handleCreateProperty(formData);
      navigate("/dashboard");
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
        <div className="contain">
          {/* container  */}
          <div className=" container">
            {/* property form */}
            <form onSubmit={handleSubmit} className="createPropertyForm">
              <p className="msg">Fill all input</p>
              <span className="line"></span>
              <div className="formContainer">
                {/* upload img section  */}
                <div className="addImg">
                  <label
                    className="createPropertyLabels"
                    htmlFor="images"
                    ref={imageRef}>
                    <span className="plus">+</span>
                    {files.length > 0
                      ? ` ${files.length}/3 Files
                         selected`
                      : " Click to add image"}
                  </label>
                  <input
                    id="images"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => setFiles(e.target.files)}
                    type="file"
                  />
                </div>
                {/* title section  */}
                <section>
                  <label className="createPropertyLabels" htmlFor="title">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    id="title"
                    placeholder="New 2 Bedroom Duplex with astonishing City Views"
                    onChange={handleChange}
                    value={formData.title}
                    className="propertyFormInput"
                  />
                </section>
                {/* address section  */}
                <section>
                  <label className="createPropertyLabels" htmlFor="address">
                    Address
                  </label>
                  <input
                    required
                    type="text"
                    id="address"
                    placeholder="Nnamdi Azikiwe street"
                    onChange={handleChange}
                    value={formData.address}
                    className="propertyFormInput"
                  />{" "}
                  <input
                    required
                    className="propertyFormInput"
                    type="text"
                    id="state"
                    placeholder="Anambra"
                    onChange={handleChange}
                    value={formData.state}
                  />
                  <input
                    required
                    className="propertyFormInput"
                    type="text"
                    id="city"
                    onChange={handleChange}
                    placeholder="Nnewi"
                    value={formData.city}
                  />
                </section>
                {/* House type section  */}
                <section>
                  <label className="createPropertyLabels" htmlFor="type">
                    Type
                  </label>
                  <input
                    required
                    type="text"
                    id="houseType"
                    placeholder="Duplex"
                    onChange={handleChange}
                    value={formData.houseType}
                    className="propertyFormInput"
                  />
                </section>
                {/* amenities section  */}
                <section>
                  <label className="createPropertyLabels" htmlFor="amenities">
                    Amenities
                  </label>
                  <input
                    required
                    type="text"
                    id="amenities"
                    placeholder="Balcony, 
              Parking,
              Swimming Pool  etc.."
                    onChange={handleChange}
                    value={formData.amenities}
                    className="propertyFormInput"
                  />
                </section>
                {/* description section  */}
                <section>
                  <label className="createPropertyLabels" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="formDescription"
                    required
                    name=""
                    id="description"
                    cols="30"
                    rows="5"
                    onChange={handleChange}
                    value={formData.description}
                    placeholder="A beautiful 2-bedroom, 3-bathroom all in suite duplex located in the reare part of the city. With stunning views , spacious living areas, and and well  furnished..."></textarea>
                </section>
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
                    <span className="createPropertyLabels">Sale</span>
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
                    <span className="createPropertyLabels">Rent</span>
                  </div>

                  {/* rooms */}
                  <div className="boxContainer">
                    <div className="eachBox">
                      <input
                        type="number"
                        id="bedrooms"
                        min={"1"}
                        max={"10"}
                        className="roomBoxes"
                        required
                        onChange={handleChange}
                        value={formData.bedrooms}
                      />
                      <p className="createPropertyLabels">: Beds</p>
                    </div>
                    <div className="eachBox">
                      <input
                        type="number"
                        id="bathrooms"
                        min={"1"}
                        max={"10"}
                        className="roomBoxes"
                        required
                        onChange={handleChange}
                        value={formData.bathrooms}
                      />
                      <p className="createPropertyLabels">: Bath</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="submitContainer">
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
                <button disabled={loading} className="propertySubmitButton">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}

export default CreateProperty;
