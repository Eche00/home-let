import { useState, useEffect } from "react";
import "../styles/Profile.css";
import { getAuth } from "firebase/auth";
import flat from "../assets/fiat.png";

const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(
    ""
  );
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    title: "Apartment Seeker",
    aboutMe: "I am actively seeking apartments in major cities...",
    email: "johndoe@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    localGovernmentArea: "Downtown",
    state: "New York",
    landmark: "Central Park",
    linkedin: "",
    twitter: "",
    instagram: "",
  });
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    // Update user displayName with the first and last name
    if (user) {
      user.updateProfile({
        displayName: `${formData.firstName} ${formData.lastName}`,
      }).then(() => {
        setIsEditable(false); 
      }).catch((error) => {
        console.error("Error updating profile: ", error);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-details">
        <div className="profile-img">
          <img
            className="profile-image"
            src={profileImage || flat}
            alt="Profile"
          />
          {isEditable && (
            <>
              <div className="upload-plus" onClick={handleUploadClick}>
                +
              </div>
              <input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </>
          )}
          <div className="edit-icon" onClick={handleEditClick} />
        </div>

        <div className="profile-section">
          <div className="profile-intro">
            <h1 className="profile-name">
              {user?.displayName || "No name to display"}
            </h1>
            <p className="profile-title">{formData.title}</p>
          </div>
          <h2>About Me</h2>
          <textarea
            className="about-me"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleInputChange}
            disabled={!isEditable}
          />

          <div className="contact-socials-container">
            <div className="flex-row">
              <div className="flex-column">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex-column">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-column">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex-column">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-column">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex-column">
                <label>Local Government Area</label>
                <input
                  type="text"
                  name="localGovernmentArea"
                  value={formData.localGovernmentArea}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-column">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex-column">
                <label>Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-column">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex-column">
                <label>Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
              <div className="flex-column">
                <label>Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>

          {isEditable && (
            <button onClick={handleSaveClick} className="save-button">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
