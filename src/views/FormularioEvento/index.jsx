import React, { useState } from 'react';
import axios from 'axios';
import FormInput from "../../components/FormInput"; 
import './styles.css';
import config from '../../config';

const FormularioEvento = () => {
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        id_event_category: '',
        id_event_location: '',
        start_date: '',
        duration_in_minutes: '',
        price: '',
        enabled_for_enrollment: false,
        max_assistance: '',
      });
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
          ...eventData,
          [name]: type === 'checkbox' ? checked : value,
        });
        setError(''); // Limpiar el mensaje de error al cambiar el input
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores anteriores
        setSuccess('');
        const token = localStorage.getItem('token');
        try {
          const response = await axios.post(`${config.url}api/event`, eventData, {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el Bearer Token aquí
              },
          });
          setSuccess('Evento creado con éxito!');
          console.log('Respuesta del servidor:', response.data);
          // Limpiar el formulario después de enviar
          setEventData({
            name: '',
            description: '',
            id_event_category: '',
            id_event_location: '',
            start_date: '',
            duration_in_minutes: '',
            price: '',
            enabled_for_enrollment: false,
            max_assistance: '',
          });
        } catch (error) {
          console.error('Error al crear el evento:', error);
          // Mostrar mensaje de error desde el backend si está disponible
          if (error.response && error.response.data) {
            setError(error.response.data); // Mostrar el mensaje de error del backend
          } else {
            setError('Ocurrió un error al crear el evento. Intenta nuevamente.');
          }
        }
      };

      return (
        <div className="container">
          <h2>Crear Evento</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
    
            <FormInput
              label="Nombre del Evento"
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre del evento"
              className="form-control"
            />
            <FormInput
              label="Descripción"
              type="text"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder="Ingresa una descripción del evento"
              className="form-control"
            />
            <FormInput
              label="Categoría del Evento"
              type="text"
              name="id_event_category"
              value={eventData.id_event_category}
              onChange={handleChange}
              placeholder="Ingresa la categoría del evento"
              className="form-control"
            />
            <FormInput
              label="Ubicación del Evento"
              type="text"
              name="id_event_location"
              value={eventData.id_event_location}
              onChange={handleChange}
              placeholder="Ingresa la ubicación del evento"
              className="form-control"
            />
            <FormInput
              label="Fecha de Inicio"
              type="date"
              name="start_date"
              value={eventData.start_date}
              onChange={handleChange}
              className="form-control"
            />
            <FormInput
              label="Duración (en minutos)"
              type="number"
              name="duration_in_minutes"
              value={eventData.duration_in_minutes}
              onChange={handleChange}
              placeholder="Ingresa la duración del evento"
              className="form-control"
            />
            <FormInput
              label="Precio"
              type="number"
              name="price"
              value={eventData.price}
              onChange={handleChange}
              placeholder="Ingresa el precio del evento"
              className="form-control"
            />
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="enabled_for_enrollment"
                  checked={eventData.enabled_for_enrollment}
                  onChange={handleChange}
                />
                Habilitar inscripción
              </label>
            </div>
            <FormInput
              label="Máximo de Asistencia"
              type="number"
              name="max_assistance"
              value={eventData.max_assistance}
              onChange={handleChange}
              placeholder="Ingresa el máximo de asistencia"
              className="form-control"
            />
            <button type="submit" className="btn">Crear Evento</button>
          </form>
        </div>
      );
}

export default FormularioEvento;
