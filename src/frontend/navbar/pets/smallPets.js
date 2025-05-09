import React, { useEffect, useState } from "react";
import './smallPets.css'
import { Link } from "react-router-dom";
import petsData from "../../../data/smallPets.json";

const SmallPets = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        setPets(petsData);
    }, []);

    return (
        <div className="small-page">
            <Link to={"/petinfo"} className="back-button">Back</Link>
            <h1>Small Pets</h1>
            <div className="small-pets-content">
                <div className="pets-list">
                    {pets.map((pet, index) =>(
                        <div key={index} className="pet-card">
                            <img src={pet.image} alt={pet.name} />
                            <h2>{pet.name}</h2>
                            <p><strong>Origin:</strong> {pet.origin}</p>
                            <p><strong>Life Span:</strong> {pet.life_span}</p>
                            <p><strong>Description:</strong> {pet.description}</p>
                            <p><strong>Fun Fact:</strong> {pet.fun_fact}</p>
                        </div>   
                    ))}
                </div>
            </div>
        </div>
    )
};

export default SmallPets;