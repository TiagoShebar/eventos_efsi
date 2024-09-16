import React, { useState } from 'react';
import axios from 'axios';
import FormInput from '../../components/FormInput/input';
import config from '../../config';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "./styles.css";

const InicioSesion = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const [loginError, setLoginError] = useState(''); // Para manejar errores de login

    const navigate = useNavigate(); // Crea una instancia de useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { username: '', password: '' };

        // Verificación de username
        if (formData.username.trim().length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
            valid = false;
        }

        // Verificación de password
        if (formData.password.trim().length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(`${config.url}api/user/login`, formData);
                console.log('Respuesta del servidor:', response.data);
                if (response.data.success) {
                    // Guardar el token y redirigir
                    console.log('Inicio de sesión exitoso');
                    localStorage.setItem("token", response.data.token);
                    navigate("/"); // Redirige al usuario a la página principal
                    window.location.reload();
                } else {
                    setLoginError(response.data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                setLoginError('Error al iniciar sesión. Intenta nuevamente.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Nombre de Usuario"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre de usuario"
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
                
                <FormInput
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                />
                {errors.password && <p className="error-text">{errors.password}</p>}

                {loginError && <p className="error-text">{loginError}</p>}
                
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                <p><a href="/register">¿No tienes una cuenta? Regístrate aquí.</a></p>
            </form>
        </div>
    );
}

export default InicioSesion;
