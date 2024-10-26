import { useState } from "react";
import "../styles/Settings.css";
import VendorImg from "../assets/vendorImg.jpg";
const Settings = () => {
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (API call, validation, etc.)
    setSubmitted(true);
  };

  return (
    <div className="settings">
      <div className="settings-info">
        <h2>Settings</h2>
      </div>

      <div className="settings-container">
        <div className="settings-img">
          <img src={VendorImg} alt="Vendor" />
        </div>
        <section className="vendor-request-section">
          {submitted ? (
            <p className="success-message">
              Your request has been submitted successfully!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="vendor-request-form">
              <h3>Request to Become a Vendor</h3>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessDescription">
                  Business Description
                </label>
                <textarea
                  id="businessDescription"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;
