import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import "./styles.css";

const ListadoEventos = () => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        tag: '',
        startDate: '',
        name: '',
        category: ''
    });
    const [applyFilters, setApplyFilters] = useState(true); // Inicialmente true

    const fetchEvents = async () => {
        const {
            name = '',
            tag = '',
            start_date = '',
            category = '',
            page = 1,
            limit = 10
        } = filters;

        let queryParams = [];

        if (name.trim()) queryParams.push(`name=${name}`);
        if (tag.trim()) queryParams.push(`tag=${tag}`);
        if (start_date.trim()) queryParams.push(`startdate=${start_date}`);
        if (category.trim()) queryParams.push(`category=${category}`);
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
        console.log('Fetching data with query:', queryString);
        try {
            const response = await axios.get(`${config.url}api/event${queryString}`);
            
            setEvents(response.data.collection);
            setTotal(response.data.pagination.total);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents(); // Llama a fetchEvents al montar el componente
    }, []);

    useEffect(() => {
        if (applyFilters || page === 1) { // Ejecuta en el primer render y cuando se aplican filtros
            fetchEvents();
            setApplyFilters(false); // Resetea applyFilters después de aplicar
        }
    }, [applyFilters, page]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyFilters = () => {
        setApplyFilters(true); // Establece applyFilters a true para aplicar filtros
    };

    const handleNextPage = () => {
        if (page * limit < total) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="event-list">
            <h1>Listado de Eventos</h1>
            
            <div className="filters">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Buscar por nombre" 
                    value={filters.name} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Categoría" 
                    value={filters.category} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="text" 
                    name="tag" 
                    placeholder="Etiqueta" 
                    value={filters.tag} 
                    onChange={handleFilterChange} 
                />
                <input 
                    type="date" 
                    name="startDate" 
                    placeholder="Fecha de inicio" 
                    value={filters.startDate} 
                    onChange={handleFilterChange} 
                />
                <button onClick={handleApplyFilters}>Aplicar Filtros</button>
            </div>

            <ul>
                {events.length > 0 ? (
                    events.map(event => (
                        <li key={event.id}>
                            <h2>{event.name}</h2>
                            <p>{event.description}</p>
                            <p>Categoría: {event.event_category.name}</p>
                            <p>Ubicación: {event.event_location.full_address}</p>
                            <p>Fecha de inicio: {new Date(event.start_date).toLocaleString()}</p>
                            <p>Tags: {event.tags ? event.tags.map(tag => tag.name).join(', ') : 'N/A'}</p>
                        </li>
                    ))
                ) : (
                    <p>No hay eventos disponibles</p>
                )}
            </ul>

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Anterior
                </button>
                <span>Página {page}</span>
                <button onClick={handleNextPage} disabled={page * limit >= total}>
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default ListadoEventos;
