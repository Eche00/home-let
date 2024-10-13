// ! Update with navigation if user does not have an account and needs to register
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import "../styles/Login.css"; 
import hood from '../assets/hood.jpg'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address format. Please check your email.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password. Please try again.";
      case "auth/too-many-requests":
        return "Too many login attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      const customErrorMessage = handleErrorMessage(error.code);
      setError(customErrorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
    <div className="login-content">
      <img src={hood} alt="Login illustration" className="login-image" />
      <div className="login-form-container">
        <h1 className="login-title">Login</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? "disabled" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="forgot-password">
            <Link to="/Password">Forgot Password?</Link>
          </div>
          <div className="forgot-password">
          Don't have an account?  <Link to="/register">Register Now</Link>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
