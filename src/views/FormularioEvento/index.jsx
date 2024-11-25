import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import FormInput from "../../components/FormInput"; 
import './styles.css';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../AuthContext";
import Select from 'react-select';

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
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);  // Estado de carga
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventData({
            ...eventData,
            [name]: type === 'checkbox' ? checked : value,
        });
        setError('');
    };
    

    useEffect(() => {
        // Cargar las categorías y ubicaciones
        const fetchCategoriesAndLocations = async () => {
            const token = localStorage.getItem('token');

            try {
                const categoriesResponse = await axios.get(`${config.url}api/event-category`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Agregar el Bearer token en la cabecera
                    },
                    
                    params: { limit: 100000 },
                });
                const locationsResponse = await axios.get(`${config.url}api/event-location`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Agregar el Bearer token en la cabecera
                    },
                    params: { limit: 100000 },
                });
                
                setCategories(categoriesResponse.data.collection);
                setLocations(locationsResponse.data.collection);
                console.log(categoriesResponse.data.collection, locationsResponse.data.collection);
            } catch (error) {
                console.error('Error fetching categories and locations:', error);
                setError('Error al cargar categorías y ubicaciones');
            } finally {
                setLoading(false);  // Cambiar a false cuando termine de cargar
            }
        };
        
        fetchCategoriesAndLocations();
    }, []); 
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
  
        const token = localStorage.getItem('token');
      
        const formattedStartDate = new Date(eventData.start_date).toISOString().slice(0, 19);
        const formattedEventData = {
            ...eventData,
            start_date: formattedStartDate,
        };
  
        try {
            const response = await axios.post(`${config.url}api/event`, formattedEventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Evento creado con éxito!');
            console.log('Respuesta del servidor:', response.data);
        
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
            console.log(error.response)
            if (error.response && error.response.data) {
                setError(error.response.data || error.response.data.detail || 'Ocurrió un error. Intenta nuevamente.');
            } else {
                setError('Ocurrió un error al crear el evento. Intenta nuevamente.');
            }
        }
    };

    // Condicionar el renderizado para esperar hasta que se hayan cargado las categorías y ubicaciones
    if (loading) {
        return <div>Cargando...</div>;  // Mostrar un mensaje o spinner mientras se cargan los datos
    }

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
                {/* Categoría del Evento con react-select */}
                <div className="form-group">
    <label>Categoría del Evento</label>
    <Select
        name="id_event_category"
        value={selectedCategory} // Aseguramos que el valor no sea undefined ni null
        onChange={(selectedOption) => {
            setEventData({ ...eventData, id_event_category: selectedOption.value });
            setSelectedCategory(selectedOption);
        }}
        options={categories.map(category => ({
            value: category.id,
            label: category.name
        }))}
        placeholder="Selecciona una categoría"
    />
</div>



{/* Ubicación del Evento con react-select */}
<div className="form-group">
    <label>Ubicación del Evento</label>
    <Select
        name="id_event_location"
        value={selectedLocation}  // Aseguramos que siempre haya un objeto válido
        onChange={(selectedOption) =>{
            setEventData({ ...eventData, id_event_location: selectedOption && selectedOption.value });
              // Asegura que el valor sea válido
            setSelectedLocation(selectedOption);
        }}
        options={locations.map(location => ({
            value: location.id,
            label: location.name
        }))}
        placeholder="Selecciona una ubicación"
    />
</div>

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
