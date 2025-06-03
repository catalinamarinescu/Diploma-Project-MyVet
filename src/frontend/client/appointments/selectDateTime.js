import React, { useEffect, useState } from 'react';
import './selectDateTime.css';

const StepSelectDateTime = ({ formData, setFormData, onNext, onBack }) => {
  const token = localStorage.getItem('myvet_token');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [timesForDate, setTimesForDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requiredDuration, setRequiredDuration] = useState(0);

  useEffect(() => {
    if (!formData.clinicId || !formData.medicId) return;

    const fetchDuration = async () => {
      const ids = [formData.selectedService, ...formData.selectedExtras];
      const res = await fetch(`http://localhost:5000/api/client/clinic/${formData.clinicId}/servicii`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const durata = data.filter(s => ids.includes(s.ID)).reduce((sum, s) => sum + s.durata, 0);
      setRequiredDuration(durata);
    };

    fetchDuration();
  }, [formData]);

  useEffect(() => {
    if (!formData.medicId || requiredDuration === 0) return;

    const today = new Date();
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });

    const fetchSlots = async () => {
      setLoading(true);
      const results = [];

      for (const d of days) {
        const dateStr = d.toISOString().split('T')[0];
        const res = await fetch(`http://localhost:5000/api/client/angajati/${formData.medicId}/timeslots?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const validIntervals = findValidIntervals(data, requiredDuration);
        if (validIntervals.length > 0) {
          results.push({
            date: dateStr,
            display: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            slots: validIntervals
          });
        }
      }

      setAvailableDates(results);
      setLoading(false);
    };

    fetchSlots();
  }, [formData.medicId, requiredDuration]);

  const findValidIntervals = (slots, duration) => {
    const neededSlots = Math.ceil(duration / 30);
    const valid = [];

    for (let i = 0; i <= slots.length - neededSlots; i++) {
      const chunk = slots.slice(i, i + neededSlots);
      if (!chunk.every(s => s.type === 'free')) continue;

      let consecutive = true;
      for (let j = 1; j < chunk.length; j++) {
        const [ph, pm] = chunk[j - 1].time.split(':').map(Number);
        const [ch, cm] = chunk[j].time.split(':').map(Number);
        const diff = (ch * 60 + cm) - (ph * 60 + pm);
        if (diff !== 30) {
          consecutive = false;
          break;
        }
      }

      if (!consecutive) continue;

      const [sh, sm] = chunk[0].time.split(':').map(Number);
      const start = chunk[0].time;
      const totalMin = sh * 60 + sm + duration;
      const end = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
      valid.push({ start, end });
    }

    return valid;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const found = availableDates.find(d => d.date === date);
    setTimesForDate(found?.slots || []);
  };

  const handleTimeSelect = (start, end) => {
    setFormData({ ...formData, date: selectedDate, time: start, timeEnd: end });
  };

  return (
    <div className="step-section-dateT">
      <h3>Date & Time</h3>
      <p>Step 6 of 7</p>

      {loading ? <p>Loading slots...</p> : (
        <>
          <h4>Select Date</h4>
          <div className="date-list">
            {availableDates.map(d => (
              <label key={d.date} className="date-option">
                <input
                  type="radio"
                  name="selectedDate"
                  value={d.date}
                  checked={selectedDate === d.date}
                  onChange={() => handleDateSelect(d.date)}
                />
                <span>{d.display}</span>
              </label>
            ))}
          </div>

          {selectedDate && (
            <>
              <h4>Select Time</h4>
              <div className="time-buttons">
                {timesForDate.map((slot, i) => (
                  <button
                    key={i}
                    className={`time-btn ${formData.time === slot.start ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot.start, slot.end)}
                  >
                    <img src="/imagini/clock.png" alt="Clock" className="icon-clock" />
                    {slot.start} - {slot.end}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div className="nav-buttons-split-dateT">
        <button className="btn-outline-dateT" onClick={onBack}>← Previous</button>
        <button className="btn-next-dateT" onClick={onNext} disabled={!formData.date || !formData.time}>Next →</button>
      </div>
    </div>
  );
};

export default StepSelectDateTime;
