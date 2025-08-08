import { useState, useEffect } from "react";
import "../styles/Settings.css";
import VendorImg from "../assets/vendorImg.jpg";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";
import Loading from "../components/loading";
import toast from "react-hot-toast";

const auth = getAuth();

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    businessName: "",
    businessDescription: "",
    number: "",
    location: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("pending");
  const nigerianStates = [
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

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const vendorDocRef = doc(db, "vendors", user.uid);
        const userDocRef = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(vendorDocRef, async (docSnap) => {
          let fullName = "";
          let email = user.email;
          let number = "";

          // Try to get fullName from vendors doc
          if (docSnap.exists()) {
            const data = docSnap.data();
            fullName = data.fullName || "";
            email = data.email || email;
            number = data.number || number;

            // Fallback to users collection if missing
            if (!fullName) {
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                fullName = userDocSnap.data().fullName || "";
              }
            }

            setFormData({
              fullName,
              email,
              businessName: data.businessName || "",
              businessDescription: data.businessDescription || "",
              number,
              location: data.location || "",
            });

            const docStatus = data.status || "pending";
            setStatus(docStatus);

            if (docStatus === "approved") {
              setSubmitted(true);
              setError("");
            } else if (docStatus === "rejected") {
              setSubmitted(false);
              const rejectionMessage =
                "Your request was rejected or removed. Please reapply.";
              setError(rejectionMessage);
              toast.error(rejectionMessage, {
                duration: 5000,
                style: {
                  background: "#ffe3e3",
                  color: "#d32f2f",
                  border: "1px solid #f44336",
                },
              });
            } else {
              setSubmitted(true);
              setError("");
            }
          } else {
            // No vendor doc: fallback to user doc
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              fullName = userDocSnap.data().fullName || "";
            }

            setFormData({
              fullName,
              email,
              businessName: "",
              businessDescription: "",
              number,
              location: "",
            });

            setSubmitted(false);
            setError("");
          }

          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setError("You must be logged in to submit a vendor request.");
      return;
    }

    const vendorData = {
      ...formData,
      uid: user.uid,
      status: "pending",
      email: user.email,
      createdAt: new Date().toISOString(),
    };

    try {
      const vendorDocRef = doc(db, "vendors", user.uid);
      await setDoc(vendorDocRef, vendorData, { merge: true });

      setSubmitted(true);
      setStatus("pending");
      setError("");
      toast.success("Vendor details submitted successfully!");
    } catch (error) {
      console.error("Error saving vendor details:", error.message);
      toast.error("Failed to submit your request. Please try again.");
      setError("Failed to submit your request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings-info">
        <h2>Settings</h2>
      </div>

      <div className="settings-container">
        <div className="settings-img">
          <img src={VendorImg} alt="Vendor" />
          <div className="overlay-gradient"></div>
        </div>

        <section className="vendor-request-section">
          {submitted ? (
            <div>
              <p className="success-message">
                {status === "approved"
                  ? "Your vendor request has been approved!"
                  : "Your request is pending approval."}
              </p>
              <div className="submitted-details">
                <p>Full Name: {formData.fullName}</p>
                <p>Email: {formData.email}</p>
                <p>Number: {formData.number}</p>
                <p>Business Name: {formData.businessName}</p>
                <p>Business Description: {formData.businessDescription}</p>
                <p>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="vendor-request-form">
              <h3>Request to Become a Vendor</h3>
              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  readOnly
                  className="read-only-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  readOnly
                  className="read-only-field"
                  title="Your email is fetched from your account and cannot be changed."
                />
              </div>

              <div className="form-group">
                <label htmlFor="number">Phone Number</label>
                <input
                  type="tel"
                  id="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessDescription">
                  Business Description
                </label>
                <textarea
                  id="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location (State)</label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a state</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
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
