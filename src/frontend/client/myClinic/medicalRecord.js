import React, { useEffect, useState } from 'react';
import SummaryTab from './tabs/summary';
import ClientVisitTab from './tabs/visits';
import ClientVaccinationTab from './tabs/vaccinations';
import ClientLabResultsTab from './tabs/lab';
import './medicalRecord.css';

const MedicalRecordTabs = ({ petId, clinicId }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [medicalData, setMedicalData] = useState(null);
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/client/pet/${petId}/medical-record?clinicId=${clinicId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMedicalData(data);
      } catch (err) {
        console.error('Failed to load medical record:', err);
      }
    };
    fetchMedicalRecord();
  }, [petId, clinicId, token]);

  if (!medicalData) return <p style={{ padding: '1rem' }}>Loading medical record...</p>;

  return (
    <div className="record-inline-container">
      <div className="tabs-md">
        {['summary', 'visits', 'vaccinations', 'lab'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab-md active' : 'tab-md'}
            onClick={() => setActiveTab(tab)}
          >
            <img
              src={`/imagini/${tab}.png`}
              alt={tab}
              className="tab-icon"
            />
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content-md">
        {activeTab === 'summary' && <SummaryTab petId={petId} clinicId={clinicId} />}
        {activeTab === 'visits' && <ClientVisitTab petId={petId} clinicId={clinicId} />}
        {activeTab === 'vaccinations' && <ClientVaccinationTab petId={petId} clinicId={clinicId} />}
        {activeTab === 'lab' && <ClientLabResultsTab petId={petId} clinicId={clinicId} />}
      </div>
    </div>
  );
};

export default MedicalRecordTabs;
