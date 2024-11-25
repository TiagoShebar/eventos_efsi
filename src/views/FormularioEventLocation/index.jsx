import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import Select from 'react-select';

const FormularioEventLocation = () => {
    const [locations, setLocations] = useState([]); // Para almacenar las ubicaciones
    const [selectedLocation, setSelectedLocation] = useState(null); // Para almacenar la ubicación seleccionada
    const [locationDetails, setLocationDetails] = useState(null); // Para almacenar los detalles de la ubicación
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Cargar las ubicaciones disponibles
    useEffect(() => {
        const fetchLocations = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${config.url}api/event-location`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Enviar token en las cabeceras
                    },
                    params: { limit: 100000 },
                });
                setLocations(response.data.collection); // Almacenamos las ubicaciones
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('Error al cargar ubicaciones');
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []); // Este useEffect se ejecuta solo una vez al cargar el componente

    // Cuando se selecciona una ubicación, obtener sus detalles
    const handleLocationChange = async (selectedOption) => {
        setSelectedLocation(selectedOption); // Guardar la ubicación seleccionada
        if (!selectedOption) return; // Si no se seleccionó ninguna, no hacemos nada

        // Cargar los detalles de la ubicación seleccionada
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${config.url}api/event-location/${selectedOption.value}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLocationDetails(response.data); // Guardamos los detalles de la ubicación
            setError(''); // Limpiar cualquier error anterior
        } catch (error) {
            console.error('Error fetching location details:', error);
            setError('Error al cargar los detalles de la ubicación');
        }
    };

    // Enviar el formulario con los nuevos detalles
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!locationDetails) return;

        const token = localStorage.getItem('token');
        try {
            // Aquí no enviamos el ID en la URL, sino en el cuerpo de la solicitud
            await axios.put(
                `${config.url}api/event-location`, // La URL ahora no contiene el ID
                {
                    id: locationDetails.id,  // Enviar el ID en el cuerpo de la solicitud
                    full_address: locationDetails.full_address,
                    max_capacity: locationDetails.max_capacity,
                    latitude: locationDetails.latitude,
                    longitude: locationDetails.longitude,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setError('');
            setSuccess('Ubicación actualizada correctamente');
            // Puedes decidir si recargar la página o redirigir al usuario a otro lugar
            window.location.reload(); 
        } catch (error) {
            if (error.response) {
                console.log('Error response:', error.response);
                setError(error.response.data || 'Error al cargar los detalles de la ubicación');
            }
            else if (error.request) {
                // Si la solicitud fue hecha pero no se recibió respuesta
                console.log('Error request:', error.request);
                setError('No se recibió respuesta del servidor');
            }
            else {
                // Si hubo un error en la configuración de la solicitud
                console.log('Error message:', error.message);
                setError('Error desconocido');
            }
        }
    };

    return (
        <div className="container">
            <h2>Editar Ubicación</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group">
                    <label>Selecciona una Ubicación</label>
                    <Select
                        name="id_event_location"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                        options={locations.map(location => ({
                            value: location.id,
                            label: location.name,
                        }))} 
                        placeholder="Selecciona una ubicación"
                    />
                </div>

                {locationDetails && (
                    <div>
                        <div className="form-group">
                            <label>Dirección Completa</label>
                            <input
                                type="text"
                                name="full_address"
                                value={locationDetails.full_address}
                                onChange={(e) => setLocationDetails({ ...locationDetails, full_address: e.target.value })}
                                className="form-control"
                                placeholder="Ingresa la dirección"
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacidad Máxima</label>
                            <input
                                type="number"
                                name="max_capacity"
                                value={locationDetails.max_capacity}
                                onChange={(e) => setLocationDetails({ ...locationDetails, max_capacity: e.target.value })}
                                className="form-control"
                                placeholder="Ingresa la capacidad máxima"
                            />
                        </div>
                        <div className="form-group">
                            <label>Latitud</label>
                            <input
                                type="text"
                                name="latitude"
                                value={locationDetails.latitude}
                                onChange={(e) => setLocationDetails({ ...locationDetails, latitude: e.target.value })}
                                className="form-control"
                                placeholder="Ingresa la latitud"
                            />
                        </div>
                        <div className="form-group">
                            <label>Longitud</label>
                            <input
                                type="text"
                                name="longitude"
                                value={locationDetails.longitude}
                                onChange={(e) => setLocationDetails({ ...locationDetails, longitude: e.target.value })}
                                className="form-control"
                                placeholder="Ingresa la longitud"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Actualizar Ubicación</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FormularioEventLocation;
