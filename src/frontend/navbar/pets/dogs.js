import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "./dogs.css";

const Dogs = () => {
    const [dogs, setDogs] = useState([]);
    const [cats, setCats] = useState([]);
    useEffect(() => {
        fetch("https://api.thedogapi.com/v1/breeds", {
            headers: {
                "x-api-key": "live_bRwnTjFBkF8LpACwVXiO9nw8aKBpIgtIKuCvDXUHeZlyrDpyFfXvg209xYTaiJxt"
            }    
        })
        .then(response => response.json())
        .then(data => setDogs(data))
        .catch(err => console.error("Error fetching dog data:", err));
    }, []);
        
    return (
        <div className='dogs-page'>
            <Link to="/petinfo" className='back-button'>Back</Link>
            <h1>Dogs </h1>
            <div className='breed-list'>
                {
                    dogs.map((dog) => (
                        <div className='breed-card' key={dog.id}>
                            <img src={dog.image.url} alt={dog.name} />
                            <h2>{dog.name}</h2>
                            <p><strong>Breed Group: </strong>{dog.breed_group}</p>
                            <p><strong>Life Span:</strong> {dog.life_span}</p>
                            <p><strong>Temperament:</strong> {dog.temperament}</p>
                        </div>
                    ))
                }
            </div>        
        </div>
    );
};

export default Dogs;