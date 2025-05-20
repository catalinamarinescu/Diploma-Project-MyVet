import React, { useEffect, useState } from 'react';
import './labResults.css';

const LabResultsTab = ({ petId }) => {
  const [labResults, setLabResults] = useState([]);
  const [newResult, setNewResult] = useState({
    name: '',
    date: '',
    status: 'Normal',
    file: null,
    summary: ''
  });

  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/lab-results`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLabResults(data);
      } catch (err) {
        console.error('Failed to fetch lab results:', err);
      }
    };

    fetchLabResults();
  }, [petId, token]);

  const handleFileChange = (e) => {
    setNewResult({ ...newResult, file: e.target.files[0] });
  };

  const handleAdd = async () => {
  if (!newResult.name || !newResult.date) {
    alert('Please complete all required fields (name and date).');
    return;
  }

  const formData = new FormData();
    formData.append('name', newResult.name);
    formData.append('date', newResult.date);
    formData.append('status', newResult.status);
    formData.append('summary', newResult.summary);
    if (newResult.file) {
        formData.append('file', newResult.file);
    }

    try {
        const res = await fetch(`http://localhost:5000/api/clinic/pet/${petId}/lab-results`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
        });

        if (!res.ok) throw new Error('Eroare la încărcare');

        const updated = await res.json();
        setLabResults(prev => [...prev, updated]);
        setNewResult({ name: '', date: '', status: 'Normal', file: null, summary: '' });
    } catch (err) {
        console.error('Eroare la adăugare lab:', err);
    }
};


  return (
    <div className="lab-results">
      <div className="lab-header">
        <h3>Laboratory Results</h3>
        <div className="lab-add-form">
          <input type="text" placeholder="Test name" value={newResult.name} onChange={e => setNewResult({ ...newResult, name: e.target.value })} />
          <input type="date" value={newResult.date} onChange={e => setNewResult({ ...newResult, date: e.target.value })} />
          <select value={newResult.status} onChange={e => setNewResult({ ...newResult, status: e.target.value })}>
            <option>Normal</option>
            <option>Abnormal</option>
          </select>
          <input type="file" onChange={handleFileChange} />
          <textarea placeholder="Summary..." value={newResult.summary} onChange={e => setNewResult({ ...newResult, summary: e.target.value })} />
          <button onClick={handleAdd}>+ Add Lab Result</button>
        </div>
      </div>

      {labResults.map(result => (
      <div className="lab-card" key={result.ID}>
        <div className="lab-header-row">
          <h4>{result.NAME}</h4>
          <span className={`badge ${result.STATUS.toLowerCase()}`}>{result.STATUS}</span>
        </div>
        <p className="lab-date">{new Date(result.TEST_DATE).toLocaleDateString()}</p>
        <p className="lab-summary">{result.SUMMARY}</p>
        {result.FILE_URL && (
          <a href={`http://localhost:5000/${result.FILE_URL}`} target="_blank" rel="noreferrer" className="download-btn">
            ⬇ Download
          </a>
        )}
      </div>
      ))}
    </div>
  );
};

export default LabResultsTab;
