import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// Create the AuthProvider to wrap your app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // state to store authenticated user

    useEffect(() => {
        // Check if the user is in localStorage (this could also be an API call)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse the user data and set it in state
        }
    }, []);

    const login = (userData) => {
        setUser(userData); // Set the user in the state
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
    };

    const logout = () => {
        setUser(null); // Clear user state
        localStorage.removeItem('user'); // Remove user data from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
