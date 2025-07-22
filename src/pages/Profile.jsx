import { useState, useEffect } from "react";
import "../styles/Profile.css";
// import { db } from "../lib/firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

import flat from "../assets/fiat.png";

const Profile = () => {
  const auth = getAuth();
  const [setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "Doe",
    title: "Apartment Seeker",
    aboutMe: "I am actively seeking apartments in major cities...",
    email: "johndoe@example.com",
    number: "",
    state: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const db = getFirestore();
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData({
            firstName: data.fullName?.split(" ")[0] || "",
            lastName: data.fullName?.split(" ")[1] || "",
            title: "Apartment Seeker",
            username: data.username || "",
            aboutMe: "I am actively seeking apartments in major cities...",
            email: data.email,
            number: data.number || "",
            state: data.state || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
          });
        }

        setUser(currentUser);
      }
    };

    fetchUserData();
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

  const handleSaveClick = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setSaving(true);
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          fullName: `${formData.firstName} ${formData.lastName}`,
          number: formData.number,
          username: formData.username,
          state: formData.state,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          instagram: formData.instagram,
          aboutMe: formData.aboutMe,
        });

        setIsEditable(false);
      } catch (error) {
        console.error("Error updating profile: ", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const statesInNigeria = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  return (
    <div className="profile-container">
      <div className="profile-setting">
        <h1>Profile Settings</h1>
        <span>Manage your account settings and set your preferences.</span>
      </div>
      <div className="profile-details">
        <div className="personal-info">
          <h2>Personal Information</h2>
          <span>Update your personal details and profile infornation</span>
        </div>
        <div className="personal-details">
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
          <div className="profile-intro">
            <h1 className="profile-name">
              {formData.username || "No name to display"}
            </h1>

            <p className="profile-title">{formData.title}</p>
          </div>
        </div>

        <div className="profile-section">
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
                  disabled
                />
                <span>
                  Email cannot be changed. Contact administration for email
                  update
                </span>
              </div>
              <div className="flex-column">
                <label>Phone</label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="flex-row">
              <div className="flex-column">
                <h2>About Me</h2>
                <textarea
                  className="about-me"
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-column">
                <label>State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable}
                >
                  <option value="">Select State</option>
                  {statesInNigeria.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
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
            <button
              onClick={handleSaveClick}
              className="save-button"
              disabled={saving}
            >
              {saving ? "Saving changes..." : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
