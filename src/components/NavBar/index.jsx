import { Link } from "react-router-dom"
import logo from "../../vendor/logo.jpg";
import userPhoto from "../../vendor/userPhoto.png";
import { AuthContext } from "../../AuthContext";
import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await axios.get('/api/user/username'); // Ajusta la URL según tu API
                setUsername(response.data.username); // Ajusta según la estructura de la respuesta
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        if (isLoggedIn) {
            fetchUsername();
        }
    }, [isLoggedIn]); // Dependencia de isLoggedIn

    const handleCloseSession = () => {
        localStorage.setItem('token', '');
        setIsLoggedIn(false); // Actualizar estado de inicio de sesión en el contexto
        window.location.reload();
    };
    

    return(
        <nav>
            <Link to="/"><img src={logo} width={'20px'} height={'20px'}/></Link>
            <Link to="/">Home</Link>

            {isLoggedIn ? (
                <div>
                    <img src={userPhoto} width={'20px'} height={'20px'}/>
                    <span>{username}</span> {/* Muestra el nombre de usuario aquí */}
                    <button onClick={handleCloseSession}>Cerrar sesion</button>
                </div>
            ) : (
                <Link to="/login">Ingresar</Link>
            )}
            
        </nav>
    );
    
}

export default NavBar