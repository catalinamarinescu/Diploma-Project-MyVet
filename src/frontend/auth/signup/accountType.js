import React from "react";
import { useNavigate } from "react-router-dom";
import "./accountType.css";

const picture = "/imagini/fundal.jpg";
const AccountType = () => {
    const navigate = useNavigate();
    
    return (  
        <div className="choose-container">
             <div className="background-image" style={{
            backgroundImage: `url(${picture})`,
            }}/>
            <div className="overlay"></div>    
            <h2>Join us!</h2>
            <button onClick={() => navigate('/signupAsClinic')}>Join as Clinic</button>
            <button onClick={() => navigate('/signupAsPetOwner')}>Join as Pet Owner</button>
        </div>
    );    
};

export default AccountType;