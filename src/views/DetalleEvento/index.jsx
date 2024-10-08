import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { AuthContext } from "../../AuthContext";

const DetalleEvento = () => {
    const { id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [isSuscribed, setIsSuscribed] = useState(false);
    const { isLoggedIn, ifIsLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchEventDetail = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${config.url}api/event/${id}`);

                setEventData(response);

                if(isLoggedIn){
                    const response2 = await axios.get();
                    setIsSuscribed(response2);
                }
                
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        }
    }, []);

    const handleSuscribeToEvent = async () => {
        ifIsLoggedIn();
        try {
            const response = await axios.post(`${config.url}api/event/${eventData.id}/enrollment`);
            const eventsData = response?.data?.collection || [];
            
        } catch (error) {
            console.error('Error enrolling to event:', error);
        }
    }

    const handleDesuscribeToEvent = async () => {

    }

    return (
        //falta poner la info del evento
        <div>
          {isSuscribed ? (<button onClick={handleDesuscribeToEvent}>Desuscribirme</button>):(<button onClick={handleSuscribeToEvent}>Suscribirme</button>)}
        </div>
      );
}

export default DetalleEvento;