// ! FOR IFEOMA: Update with labels, and navigate to login page with a link if user ha an account
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { handleRegistration } from "../lib/regLogic";
import "../styles/Register.css"; // Ensure the correct path
import registerImage from '../assets/woman-home.jpeg'; // Update the path as needed

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
    address: "",
    gender: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    termsAgreed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Combine the day, month, and year into a single date string
    const fullDOB = `${formData.dobYear}-${String(formData.dobMonth).padStart(2, '0')}-${String(formData.dobDay).padStart(2, '0')}`;

    try {
      await handleRegistration({
        ...formData,
        dob: fullDOB, // Send the full date as a single field
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-image">
          <img src={registerImage} alt="Register" />
        </div>
        <div className="register-form-container">
          <h1 className="register-title">Register</h1>
          {error && <p className="register-error">{error}</p>}
          <form onSubmit={handleSubmit} className="register-form">
            <label htmlFor="">Username</label>
            <input
              type="text"
              name="username"
              placeholder="ifeoma123"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="input-field"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            {/* Date of Birth Selectors */}
            <div className="dob-container">
              <select
                name="dobDay"
                value={formData.dobDay}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="" disabled>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="dobMonth"
                value={formData.dobMonth}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="" disabled>Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="dobYear"
                value={formData.dobYear}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="" disabled>Year</option>
                {Array.from({ length: 120 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <label className="register-checkbox">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                required
              />
              I agree to the Terms and Conditions
            </label>
            <button
              type="submit"
              disabled={loading}
              className={`register-button ${loading ? "disabled" : ""}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
