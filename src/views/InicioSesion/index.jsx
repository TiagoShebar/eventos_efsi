import React, { useState } from 'react';
import FormInput from '../../components/FormInput/input';
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
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
          console.log('Formulario válido. Enviando datos:', formData);
          // Aquí harías la lógica para enviar los datos al backend.
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
    
            <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
          </form>
        </div>
      );
}

export default InicioSesion;