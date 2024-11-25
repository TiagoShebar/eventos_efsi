import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import Select from 'react-select';
import FormInput from "../../components/FormInput"; // Asegúrate de tener este componente para los inputs

const FormularioEventCategory = () => {
    const [categories, setCategories] = useState([]); // Lista de categorías
    const [categoryDetails, setCategoryDetails] = useState(null); // Detalles de la categoría seleccionada
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar las categorías disponibles
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            try {
                const categoriesResponse = await axios.get(`${config.url}api/event-category`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { limit: 100000 },
                });
                setCategories(categoriesResponse.data.collection);
            } catch (error) {
                setError('Error al cargar categorías');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []); 

    // Función que maneja el cambio de selección de categoría
    const handleCategoryChange = async (selectedOption) => {
        const categoryId = selectedOption.value;

        // Realizamos una solicitud para obtener los detalles de la categoría seleccionada
        const fetchCategoryDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const categoryResponse = await axios.get(`${config.url}api/event-category/${categoryId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategoryDetails(categoryResponse.data); // Guardamos los detalles de la categoría
                setSuccess(''); // Limpiar cualquier mensaje de éxito previo
            } catch (error) {
                setError('Error al cargar los detalles de la categoría');
            }
        };

        fetchCategoryDetails();
    };

    // Función que maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!categoryDetails) return;
    
        const token = localStorage.getItem('token');
        let response = null;
    
        try {
            // Aquí enviamos el id en el cuerpo de la solicitud PUT
            response = await axios.put(
                `${config.url}api/event-category`, // Asegúrate de usar la ruta correcta en tu backend
                {
                    id: categoryDetails.id, // Enviar el id en el cuerpo
                    name: categoryDetails.name, // Campo de nombre de la categoría
                    display_order: categoryDetails.display_order, // Orden de visualización
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            // Si la respuesta es exitosa (código 200-299), se maneja aquí
            setError('');
            setSuccess('Categoría actualizada correctamente');
            window.location.reload();
        } catch (error) {
            if (error.response) {
                // Si hay una respuesta del servidor con un código de error (por ejemplo, 400)
                console.log('Error response:', error.response);
                setError(error.response.data || 'Error al actualizar la categoría');
            } else if (error.request) {
                // Si la solicitud fue hecha pero no se recibió respuesta
                console.log('Error request:', error.request);
                setError('No se recibió respuesta del servidor');
            } else {
                // Si hubo un error en la configuración de la solicitud
                console.log('Error message:', error.message);
                setError('Error desconocido');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h2>Editar Categoría de Evento</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Selección de categoría */}
                <Select
                    name="id_event_category"
                    onChange={handleCategoryChange}
                    options={categories.map(category => ({
                        value: category.id,
                        label: category.name
                    }))}
                    placeholder="Selecciona una categoría"
                />
                
                {/* Formulario de edición solo se muestra cuando se ha seleccionado una categoría */}
                {categoryDetails && (
                    <>
                        {/* Nombre de la categoría */}
                        <FormInput
                            label="Nombre de la Categoría"
                            type="text"
                            name="name"
                            value={categoryDetails.name || ''}
                            onChange={(e) => setCategoryDetails({ ...categoryDetails, name: e.target.value })}
                            placeholder="Ingresa el nombre de la categoría"
                            className="form-control"
                        />
                        {/* Orden de visualización */}
                        <FormInput
                            label="Orden de Visualización"
                            type="number"
                            name="display_order"
                            min="1"
                            value={categoryDetails.display_order || ''}
                            onChange={(e) => setCategoryDetails({ ...categoryDetails, display_order: e.target.value })}
                            placeholder="Ingresa el orden de visualización"
                            className="form-control"
                        />
                        <button type="submit" className="btn">Actualizar Categoría</button>
                    </>
                )}
            </form>

            {success && <div className="alert alert-success">{success}</div>}
        </div>
    );
};

export default FormularioEventCategory;
