import { useState, useEffect } from "react";
import "../styles/Profile.css";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import flat from "../assets/fiat.png";

const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null); // ✅ Fixed this line
  const [profileImage, setProfileImage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "",
    balance: 0, // ✅ Default number instead of string
    aboutMe: "",
    email: "",
    number: "",
    state: "",
    linkedin: "",
    twitter: "",
    address: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: ""
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
            username: data.username || "",
            role: data.role || "",
            balance: data.balance ?? 0, // ✅ Fallback to 0 if undefined
            aboutMe: data.aboutMe || "",
            email: data.email || "",
            number: data.number || "",
            state: data.state || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            address: data.address || "",
            bankName: data.bankName || "",
            accountNumber: data.accountNumber || "",
            accountHolderName: data.accountHolderName || ""
          });

          setProfileImage(data.profileImage || "");
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
          balance: Number(formData.balance), // ✅ Ensure it's saved as number
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          address: formData.address,
          aboutMe: formData.aboutMe,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountHolderName: formData.accountHolderName,
          profileImage: profileImage
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
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara",
  ];

  return (
    <div className="profile-container">
      <div className="profile-details">
        <div className="personal-info">
          <h2>Personal Information</h2>
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
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="profile-title"><strong>Account Balance:</strong> ₦{formData.balance}</p>
            <p className="profile-title"><strong>Account Type:</strong> {formData.role}</p>
          </div>
        </div>

        <div className="profile-section">
          <div className="contact-socials-container">
            {/* Name */}
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

            {/* Contact */}
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
                <span>Email cannot be changed. Contact support to update.</span>
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


            {/* Social Links */}
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

              <div className="flex-column">
                <label>Home Address</label>
                <input
                  type="url"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            {/* ✅ Bank Details */}
            <div className="flex-row">
              <div className="flex-column">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                  placeholder="My Bank"
                />
              </div>
              <div className="flex-column">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                  placeholder="1234567890"
                />
              </div>
              <div className="flex-column">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                  placeholder={formData.firstName + " " + formData.lastName}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
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
