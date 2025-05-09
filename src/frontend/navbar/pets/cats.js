import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "./cats.css";

const Cats = () => {
    const [cats, setCats] = useState([]);
    useEffect(() => {
        fetch("https://api.thecatapi.com/v1/breeds", {
            headers: {
                "x-api-key": "live_5hT8YGtnc9EFd8RdVHcpQ8zWM0YjbPvhZHR9JMvr3dVTCM0OyvPd2E4otoeRn9WK"
            }    
        })
        .then(response => response.json())
        .then(data => setCats(data))
        .catch(err => console.error("Error fetching cat data:", err));
    }, []);
        
    return (
        <div className='cats-page'>
            <Link to="/petinfo" className='back-button'>Back</Link>
            <h1>Cats </h1>
            <div className='breed-list'>
                {
                    cats.map((cat) => (
                        <div className='breed-card' key={cat.id}>
                            {cat.image && <img src={cat.image.url} alt={cat.name} />}
                            <h2>{cat.name}</h2>
                            <p><strong>Origin: </strong>{cat.origin}</p>
                            <p><strong>Life Span:</strong> {cat.life_span}</p>
                            <p><strong>Temperament:</strong> {cat.temperament}</p>
                        </div>
                    ))
                }
            </div>        
        </div>
    );
};

export default Cats;