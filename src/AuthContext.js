import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
            localStorage.setItem("token", "");
        } else if (token !== "") {
            setIsLoggedIn(true);
        }
    }, []);

    const ifIsLoggedIn = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            // Define openModal here or import it if it's defined elsewhere
            navigate("/login");
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, ifIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};