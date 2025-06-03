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
    <form className="exception-form" onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="day">Date</label>
    <input
      id="day"
      type="date"
      value={day}
      onChange={e => setDay(e.target.value)}
    />
  </div>

  <div className="form-group">
    <label>Time Interval</label>
    <div className="time-range">
      <input
        type="time"
        value={start}
        onChange={e => setStart(e.target.value)}
      />
      <span>to</span>
      <input
        type="time"
        value={end}
        onChange={e => setEnd(e.target.value)}
      />
    </div>
  </div>

  <div className="form-group">
    <label htmlFor="reason">Reason</label>
    <input
      id="reason"
      type="text"
      value={reason}
      onChange={e => setReason(e.target.value)}
      placeholder="ex: vacation, meeting..."
    />
  </div>

  <div className="work-form-actions">
    <button type="button" className="close-btn-calendar" onClick={onCancel}>Close</button>
    <button type="submit" className="save-btn-calendar">Save</button>
  </div>
</form>
  );
};

export default ExceptionForm;
