import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { AuthContext } from "../../AuthContext";

const DetalleEvento = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [isSuscribed, setIsSuscribed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchEventDetail = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${config.url}api/event/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setEventData(response.data);

                // Check if the user is subscribed
                if (isLoggedIn) {
                    const enrollmentResponse = await axios.patch(`${config.url}api/event/${id}/enrollment/${1}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('Enrollment response:', enrollmentResponse.data);

                    setIsSuscribed(enrollmentResponse.data !== null);
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setErrorMessage('Error fetching event details. Please try again.');
            }
        };

        fetchEventDetail();
    }, [id, isLoggedIn]);

    const handleSuscribeToEvent = async () => {
        if (!isLoggedIn) {
            alert('Por favor, inicie sesión para suscribirse.');
            return;
        }
        
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${config.url}api/event/${id}/enrollment`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setIsSuscribed(true);
                setErrorMessage(''); // Clear any previous error messages
            }
        } catch (error) {
            console.error('Error enrolling to event:', error);
            setErrorMessage(error.response?.data || 'Error enrolling to event. Please try again.');
        }
    };

    const handleDesuscribeToEvent = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${config.url}api/event/${id}/enrollment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setIsSuscribed(false);
                setErrorMessage(''); // Clear any previous error messages
            }
        } catch (error) {
            console.error('Error unsubscribing from event:', error);
            setErrorMessage(error.response?.data || 'Error unsubscribing from event. Please try again.');
        }
    };
    
    return (
        <div>
            {eventData && (
                <>
                    <h1>{eventData.name}</h1>
                    <p>{eventData.description}</p>
                    {/* Other event details */}
                    {isSuscribed ? (
                        <button onClick={handleDesuscribeToEvent}>Desuscribirme</button>
                    ) : (
                        <button onClick={handleSuscribeToEvent}>Suscribirme</button>
                    )}
                </>
            )}
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
};

export default DetalleEvento;
