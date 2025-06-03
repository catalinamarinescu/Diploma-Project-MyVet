// src/frontend/clinics/schedule/workHoursForm.js
import React, { useState } from 'react';
import "./schedule.css";

const days = [
  'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'
];

const WorkHoursForm = ({ initialHours = [], onSave, onCancel }) => {
  const [hours, setHours] = useState(() => {
    const map = Array(7).fill().map((_, i) => {
      const found = initialHours.find(h => h.weekday === i + 1);
      return {
        weekday: i + 1,
        startTime: found?.startTime || '',
        endTime: found?.endTime || ''
      };
    });
    return map;
  });

  const handleChange = (i, field, value) => {
    const updated = [...hours];
    updated[i][field] = value;
    setHours(updated);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(hours.filter(h => h.startTime && h.endTime));
  };

  return (
    <form className="work-form" onSubmit={handleSubmit}>
  {hours.map((h, i) => (
    <div className="work-form-card" key={i}>
      <div className="work-form-label">{days[i]}</div>
      <div className="work-form-time-range">
        <input
          type="time"
          value={h.startTime}
          placeholder="hh:mm"
          className={h.startTime ? '' : 'empty-time'}
          onChange={e => handleChange(i, 'startTime', e.target.value)}
        />
        <span>to</span>
        <input
          type="time"
          value={h.endTime}
          onChange={e => handleChange(i, 'endTime', e.target.value)}
        />
      </div>
    </div>
  ))}

  <div className="form-actions">
    <button className="close-btn-calendar" type="button" onClick={onCancel}>Close</button>
    <button className="save-btn-calendar" type="submit">Save Schedule</button>
  </div>
</form>

  );
};

export default WorkHoursForm;
