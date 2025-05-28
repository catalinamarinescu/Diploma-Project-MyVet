// ScheduleManagement.jsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from '../../navbar';
import Footer from '../../footer';
import './schedule.css';

const TYPE_COLORS = {
  'Medic veterinar': '#014421',
  'Asistent medical': '#3b82f6',
  'Receptioner':      '#f59e0b',
  'default':          '#9ca3af'
};

// Normalizează diverse formate TIME în "HH:mm"
function toHM(val) {
  if (!val) return '';
  const s = val.toString();
  // Dacă e ISO datetime
  if (s.includes('T')) {
    return s.substr(s.indexOf('T') + 1, 5);
  }
  // Dacă e "HH:mm:ss" sau "H:mm:ss"
  const parts = s.split(':');
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return s;
}

const ScheduleManagement = () => {
  const token = localStorage.getItem('myvet_token');
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);

  // Fetch employees
  useEffect(() => {
    fetch('http://localhost:5000/api/clinic/angajati', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setEmployees(
        data.map(emp => ({
          id:    emp.ID,
          name:  emp.FULL_NAME,
          type:  emp.TIP_ANGAJAT,
          color: TYPE_COLORS[emp.TIP_ANGAJAT] || TYPE_COLORS.default
        }))
      ))
      .catch(err => console.error('Error loading employees:', err));
  }, [token]);

  // Fetch schedule data
  useEffect(() => {
    if (!selected) return;

    Promise.all([
      fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/working-hours`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.ok ? r.json() : []),

      fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/exceptions`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.ok ? r.json() : []),

      fetch(`http://localhost:5000/api/clinic/programari?angajatId=${selected.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.ok ? r.json() : [])
    ])
    .then(([wh, ex, appt]) => {
      // Normalizează working hours
      const bh = wh.map(w => ({
        daysOfWeek: [w.Weekday % 7],     // 1=Mon...7=Sun→0
        startTime:  toHM(w.StartTime),
        endTime:    toHM(w.EndTime),
        display:    'background',
        color:      '#e0f7fa'
      }));
      console.log('🔨 businessHours:', bh);
      setWorkingHours(bh);

      // map appointments
      setAppointments(appt.map(a => ({
        start: a.StartDateTime,
        end:   a.EndDateTime,
        title: a.PetName,
        color: '#e76f51'
      })));

      // map exceptions
      setExceptions(ex.map(e => ({
        start:   e.StartDateTime,
        end:     e.EndDateTime,
        display: 'background',
        color:   '#cccccc'
      })));
    })
    .catch(err => console.error('Error loading schedule data:', err));
  }, [selected, token]);

  const handleDateClick = info => {
    console.log('Date clicked:', info.dateStr);
  };

  return (
    <div className="schedule-page">
      <Navbar />

      <div className="schedule-header">
        <div>
          <h2>Schedule Management</h2>
          <p>Manage doctor availability and view appointments</p>
        </div>
        <button className="btn-add-doc">+ Add Doctor</button>
      </div>

      <div className="schedule-body">
        <aside className="staff-list">
          <h3>Select Doctor</h3>
          {employees.map(emp => (
            <div
              key={emp.id}
              className={`staff-card ${selected?.id === emp.id ? 'selected' : ''}`}
              style={{ borderLeft: `4px solid ${emp.color}` }}
              onClick={() => setSelected(emp)}
            >
              <div className="avatar" />
              <div className="info">
                <strong>{emp.name}</strong>
                <span className="specialty">{emp.type}</span>
              </div>
              <div className="status-dot" style={{ backgroundColor: emp.color }} />
            </div>
          ))}
        </aside>

        <section className="calendar-section">
          {selected ? (
            <>
              <div className="calendar-header">
                <h3>
                  <i className="fa fa-calendar" />{' '}
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <span>Schedule for {selected.name} – {selected.type}</span>
              </div>

              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                businessHours={workingHours}
                events={[...appointments, ...exceptions]}
                dateClick={handleDateClick}
                height="auto"
              />

              <div className="legend">
                <div className="legend-item free"><span /> Free slot</div>
                <div className="legend-item booked"><span /> Booked appointment</div>
                <div className="legend-item blocked"><span /> Working exception</div>
              </div>
            </>
          ) : (
            <p className="no-selection">Please select a doctor on the left.</p>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ScheduleManagement;
