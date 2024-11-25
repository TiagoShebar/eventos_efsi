import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import Select from 'react-select';
import FormInput from "../../components/FormInput";

const FormularioEventCategory = () => {
    const [categories, setCategories] = useState([]);
    const [categoryDetails, setCategoryDetails] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
     
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


    const handleCategoryChange = async (selectedOption) => {
        const categoryId = selectedOption.value;

       
        const fetchCategoryDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const categoryResponse = await axios.get(`${config.url}api/event-category/${categoryId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategoryDetails(categoryResponse.data);
                setSuccess('');
            } catch (error) {
                setError('Error al cargar los detalles de la categoría');
            }
        };

        fetchCategoryDetails();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!categoryDetails) return;
    
        const token = localStorage.getItem('token');
        let response = null;
    
        try {
            
            response = await axios.put(
                `${config.url}api/event-category`,
                {
                    id: categoryDetails.id,
                    name: categoryDetails.name,
                    display_order: categoryDetails.display_order,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            
            setError('');
            setSuccess('Categoría actualizada correctamente');
            window.location.reload();
        } catch (error) {
            if (error.response) {
                
                console.log('Error response:', error.response);
                setError(error.response.data || 'Error al actualizar la categoría');
            } else if (error.request) {
                
                console.log('Error request:', error.request);
                setError('No se recibió respuesta del servidor');
            } else {
                
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

                
                <Select
                    name="id_event_category"
                    onChange={handleCategoryChange}
                    options={categories.map(category => ({
                        value: category.id,
                        label: category.name
                    }))}
                    placeholder="Selecciona una categoría"
                />
                
                
                {categoryDetails && (
                    <>
                        
                        <FormInput
                            label="Nombre de la Categoría"
                            type="text"
                            name="name"
                            value={categoryDetails.name || ''}
                            onChange={(e) => setCategoryDetails({ ...categoryDetails, name: e.target.value })}
                            placeholder="Ingresa el nombre de la categoría"
                            className="form-control"
                        />
                        
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
