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

    const ifIsLoggedIn = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
        else{
            return true;
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, ifIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};