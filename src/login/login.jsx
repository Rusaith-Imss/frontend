import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Login.css"; // Import the CSS file for styling

const Login = () => {
    const [username, setUsername] = useState(""); // Set empty default value for username
    const [password, setPassword] = useState(""); // Set empty default value for password
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(""); // Dynamic error message
    const [success, setSuccess] = useState(false); // Success state for login success message
    const { login } = useAuth();
    const navigate = useNavigate();

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    const handleLogin = () => {
        const defaultUsername = "munsi"; // Default username
        const defaultPassword = "munsi@2025"; // Default password

        if (!username || !password) {
            setError("Both fields are required.");
            setSuccess(false);
            return;
        }

        setError(""); // Clear previous errors

        // Check if the username and password match the default values
        if (username === defaultUsername && password === defaultPassword) {
            setSuccess(true);
            // Simulate a successful login
            const userData = { username, role: "admin" }; // Example user data
            login(userData);
            navigate("/");
        } else {
            setSuccess(false);
            setError("Invalid credentials.");
        }
    };

    const handleKeyDown = (e, nextFieldRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextFieldRef) {
                nextFieldRef.current.focus();
            } else {
                handleLogin();
            }
        }
    };

    return (
        <div className="w-full h-screen relative">
            <ParticleBackground />
            <div className="login-container inset-0 flex justify-center items-center">
                <motion.div
                    className="login-box mb-40 fixed hover:shadow-2xl bg-transparent bg-clip-padding border border-cyan-800 p-8 rounded-lg"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="login-title">IMSS POS</h2>
                    <p className="login-subtitle">Please login to continue</p>

                    {/* Success message animation */}
                    {success && (
                        <motion.p
                            className="success-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ color: "green" }}
                        >
                            Login Successful!
                        </motion.p>
                    )}

                    {/* Error message animation */}
                    {error && (
                        <motion.p
                            className="error-message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ color: "red" }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className="input-group">
                        <motion.input
                            ref={usernameRef}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                            placeholder="Username"
                            className="login-input"
                            whileFocus={{ scale: 1.05 }}
                        />
                        <div className="password-container">
                            <motion.input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, null)}
                                placeholder="Password"
                                className="login-input"
                                whileFocus={{ scale: 1.05 }}
                            />
                            <button
                                type="button"
                                className="show-password-button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon className="bg-transparent" icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    {/* Login Button with animation */}
                    <motion.button
                        onClick={handleLogin}
                        className="login-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        Login
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
