import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import { handleRegistration } from "../lib/regLogic";
import "../styles/Register.css";


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

    const fullDOB = `${formData.dobYear}-${String(formData.dobMonth).padStart(
      2,
      "0"
    )}-${String(formData.dobDay).padStart(2, "0")}`;

    try {
      await handleRegistration({
        ...formData,
        dob: fullDOB,
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
        <div className="register-form-container">
          <h1 className="register-title">Register</h1>
          {error && <p className="register-error">{error}</p>}
          <form onSubmit={handleSubmit} className="register-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="eg. johndoe123"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="johndoe@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="******"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              placeholder="123 Maple Leaf Street, Owerri, Imo State"
              value={formData.address}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label htmlFor="gender">Gender</label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <div className="dob-container">
              <select
                name="dobDay"
                id="dobDay"
                value={formData.dobDay}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="" disabled>
                  Day
                </option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="dobMonth"
                id="dobMonth"
                value={formData.dobMonth}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="" disabled>
                  Month
                </option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="dobYear"
                id="dobYear"
                value={formData.dobYear}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="" disabled>
                  Year
                </option>
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

            <label htmlFor="termsAgreed" className="register-checkbox">
              <input
                type="checkbox"
                name="termsAgreed"
                id="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                required
              />
            <Link to="/terms" className="click"> I agree to the Terms and Conditions</Link>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`register-button ${loading ? "disabled" : ""}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="login-redirect">
              Already have an account? <Link to="/Login" className="click">Login here</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
