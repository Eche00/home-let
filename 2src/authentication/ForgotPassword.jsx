import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import "../styles/Register.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Reset email sent! Check your inbox.");
        } catch (error) {
            // Check for Firebase-specific error codes to provide more useful feedback
            switch (error.code) {
                case "auth/invalid-email":
                    setError("Invalid email address. Please check and try again.");
                    break;
                case "auth/user-not-found":
                    setError("No user found with this email address.");
                    break;
                default:
                    setError("Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="register-form-container">
                    <h1 className="register-title">Forgot Password</h1>
                    <div className="div">
                        Enter an email address and we would try to reset your password by sending a password reset link
                    </div>
                    {error && <p className="forgot-password-error">{error}</p>}
                    {message && <p className="forgot-password-message">{message}</p>}
                    <form onSubmit={handleSubmit} className="register-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`register-button ${loading ? "disabled" : ""}`}
                        >
                            {loading ? "Sending..." : "Send Reset Email"}
                        </button>

                        <div className="auth-nav">
                           <Link to="/Login" className="click">Back to Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
