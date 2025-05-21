import React, { useEffect, useState } from 'react';
import SummaryTab from './tabs/summary';
import './medicalRecord.css';
import ClientVisitTab from './tabs/visits';
import ClientVaccinationTab from './tabs/vaccinations';
import ClientLabTab from './tabs/lab';

const MedicalRecordModal = ({ pet, medicalData, clinicId, onClose }) => {
  const [tab, setTab] = useState('summary');
  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="modal-close" onClick={onClose}>×</button>
            
            <div className="pet-header">
            <div>
                <h2>{pet.NUME} <span className="badge">{medicalData.STATUS || 'Healthy'}</span></h2>
                <div className="pet-info">
                <p>{pet.TIP} • {pet.RASA} • {pet.VARSTA} years old • {medicalData.SEX || '-'}</p>
                <p>Weight: {medicalData.WEIGHT_KG || '-'} kg</p>
                <p>Last checkup: {medicalData.LAST_CHECKUP_DATE || 'N/A'}</p>
                </div>
            </div>
            <div className="header-actions">
                <button className="nav-btn-myclinic">Schedule Visit</button>
            </div>
            </div>

            <div className="tab-menu">
            <button className={tab === 'summary' ? 'active' : ''} onClick={() => setTab('summary')}>Summary</button>
            <button className={tab === 'visits' ? 'active' : ''} onClick={() => setTab('visits')}>Visits</button>
            <button className={tab === 'vaccines' ? 'active' : ''} onClick={() => setTab('vaccines')}>Vaccinations</button>
            <button className={tab === 'lab' ? 'active' : ''} onClick={() => setTab('lab')}>Lab</button>
            </div>

            <div className="tab-content">
                {tab === 'summary' && <SummaryTab petId={pet.ID} clinicId={clinicId}/>}
                {tab === 'visits' && <ClientVisitTab petId={pet.ID} clinicId={clinicId}/>}
                {tab === 'vaccines' && <ClientVaccinationTab petId={pet.ID} clinicId={clinicId}/>}
                {tab === 'lab' && <ClientLabTab petId={pet.ID} clinicId={clinicId}/>}
            </div>
        </div>
        </div>

  );
};

export default MedicalRecordModal;
