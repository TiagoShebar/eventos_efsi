import { Link } from "react-router-dom"
import logo from "../../vendor/logo.jpg";
import userPhoto from "../../vendor/userPhoto.png";
import { AuthContext } from "../../AuthContext";
import React, { useContext } from 'react';

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

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
                    <button onClick={handleCloseSession}>Cerrar sesion</button>
                </div>
            ) : (
                <Link to="/login">Ingresar</Link>
            )}
            
        </nav>
    );
    
}

export default NavBar