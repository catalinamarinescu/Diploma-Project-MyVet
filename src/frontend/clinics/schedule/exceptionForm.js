// src/frontend/clinics/schedule/ExceptionForm.js
import React, { useState } from 'react';

const ExceptionForm = ({ date, onSave, onCancel }) => {
  const [day, setDay] = useState(date || new Date().toISOString().split('T')[0]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!start || !end || !day) return;

    const startTime = formatAsLocal(day, start);
    const endTime = formatAsLocal(day, end);

    onSave({ StartDateTime: startTime, EndDateTime: endTime, Reason: reason });
  };

  const formatAsLocal = (date, time) => {
    const [y, m, d] = date.split('-');
    const [h, min] = time.split(':');
    return `${y}-${m}-${d} ${h}:${min}`;
  };

  return (
    <form className="work-form" onSubmit={handleSubmit}>
      <label>Data:</label>
      <input
        type="date"
        value={day}
        onChange={e => setDay(e.target.value)}
        style={{ marginBottom: '0.5rem' }}
      />

      <label>Interval orar:</label>
      <div className="work-form-row">
        <input type="time" value={start} onChange={e => setStart(e.target.value)} />
        -
        <input type="time" value={end} onChange={e => setEnd(e.target.value)} />
      </div>

      <label>Motiv:</label>
      <input
        type="text"
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="ex: concediu, ședință..."
        style={{ width: '100%', marginTop: '0.5rem' }}
      />

      <button className="save-btn" type="submit">Salvează</button>
    </form>
  );
};

export default ExceptionForm;
