// ScheduleManagement.jsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from '../../navbar';
import Footer from '../../footer';
import WorkHoursForm from './workHoursForm';
import ExceptionForm from './exceptionForm';
import './schedule.css';

const TYPE_COLORS = {
  'Medic veterinar': '#014421',
  'Asistent medical': '#3b82f6',
  'Receptioner': '#f59e0b',
  'default': '#9ca3af'
};

function toHM(val) {
  if (!val) return '';
  const s = val.toString();
  if (s.includes('T')) {
    return s.substr(s.indexOf('T') + 1, 5);
  }
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
  const [modalDate, setModalDate] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/clinic/angajati', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setEmployees(
        data.map(emp => ({
          id: emp.ID,
          name: emp.FULL_NAME,
          type: emp.TIP_ANGAJAT,
          color: TYPE_COLORS[emp.TIP_ANGAJAT] || TYPE_COLORS.default
        }))
      ))
      .catch(err => console.error('Error loading employees:', err));
  }, [token]);

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
        const bh = wh.map(w => ({
          daysOfWeek: [(w.Weekday === 7 ? 0 : w.Weekday - 1)],
          startTime: toHM(w.StartTime),
          endTime: toHM(w.EndTime),
          display: 'background',
          color: '#e0f7fa'
        }));
        setWorkingHours(bh);

        setAppointments(appt.map(a => ({
          start: a.StartDateTime,
          end: a.EndDateTime,
          title: a.PetName,
          color: '#e76f51'
        })));

        setExceptions(ex.map(e => ({
          start: e.StartDateTime,
          end: e.EndDateTime,
          title: e.REASON || 'Blocare',
          color: '#cccccc'
        })));
      })
      .catch(err => console.error('Error loading schedule data:', err));
  }, [selected, token]);

  const handleDateClick = async info => {
    if (!selected) return;
    setModalDate(info.dateStr);
    const res = await fetch(
      `http://localhost:5000/api/clinic/angajati/${selected.id}/timeslots?date=${info.dateStr}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFreeSlots(await res.json());
  };

  const handleWorkHoursSave = async (hours) => {
    if (!selected) return;
    await fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/working-hours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(hours)
    });
    setShowWorkForm(false);
  };

  const handleExceptionSave = async (exception) => {
  if (!selected) return;

  try {
    const res = await fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/exceptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(exception)
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Eroare la salvare.');
      return;
    }

    const exRes = await fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/exceptions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const exData = await exRes.json();
    setExceptions(exData.map(e => ({
      start: e.StartDateTime,
      end: e.EndDateTime,
      title: e.Reason || 'Blocare',
      color: '#cccccc'
    })));
    setShowExceptionForm(false);
  } catch (err) {
    console.error('Eroare excepție:', err);
    alert('A apărut o eroare la salvarea excepției.');
  }
};

const handleDeleteException = async (exceptionId) => {
  if (!window.confirm('Ești sigur că vrei să ștergi această excepție?')) return;

  const res = await fetch(`http://localhost:5000/api/clinic/exceptions/${exceptionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.ok) {
    // Reîncarcă excepțiile
    const exRes = await fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/exceptions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const exData = await exRes.json();
      setExceptions(exData.map(e => ({
      start: e.START_DATE_TIME || e.StartDateTime,
      end: e.END_DATE_TIME || e.EndDateTime,
      title: e.REASON || e.Reason || 'Blocare',
      id: e.ID,
      color: '#cccccc'
    })));

    console.log(exData);
  } else {
    alert('Nu s-a putut șterge excepția.');
  }
};


  return (
    <div className="schedule-page">
      <Navbar />

      <div className="schedule-header">
        <div>
          <h2>Schedule Management</h2>
          <p>Manage doctor availability and view appointments</p>
        </div>
        <div className="action-buttons">
          
        <button onClick={() => setShowExceptions(true)} className="btn-secondary">
          Afișează excepții
        </button>
          <button onClick={() => setShowWorkForm(true)} className="btn-secondary">Configurează program</button>
          <button onClick={() => setShowExceptionForm(true)} className="btn-secondary">Adaugă excepție</button>
        </div>
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
                <strong>{emp.name} <br /></strong>
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

              {modalDate && (
                <div className="modal-backdrop" onClick={() => setModalDate(null)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <h3>Disponibilitate pentru {modalDate}</h3>
                    <ul className="slot-list">
                      {freeSlots.map(s => (
                        <li key={s.time} className={`slot-row ${s.type}`}>
                          <span className="slot-time">{s.time}</span>
                          <span className="slot-label">
                            {s.type === 'booked' ? s.reason :
                             s.type === 'exception' ? s.reason : 'Liber'}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button className="close-btn" onClick={() => setModalDate(null)}>Închide</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="no-selection">Please select a doctor on the left.</p>
          )}
        </section>
      </div>

      {showWorkForm && (
        <div className="modal-backdrop" onClick={() => setShowWorkForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Configurează programul de lucru</h3>
            <WorkHoursForm
              onCancel={() => setShowWorkForm(false)}
              onSave={handleWorkHoursSave}
            />
            <button className="close-btn" onClick={() => setShowWorkForm(false)}>Închide</button>
          </div>
        </div>
      )}

      {showExceptionForm && (
        <div className="modal-backdrop" onClick={() => setShowExceptionForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Adaugă excepție pentru {modalDate || '...'}:</h3>
            <ExceptionForm
              date={modalDate || new Date().toISOString().split('T')[0]}
              onSave={handleExceptionSave}
              onCancel={() => setShowExceptionForm(false)}
            />
            <button className="close-btn" onClick={() => setShowExceptionForm(false)}>Închide</button>
          </div>
        </div>
      )}
     {showExceptions && (
  <div className="modal-backdrop" onClick={() => setShowExceptions(false)}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h3>Excepții existente:</h3>
      <ul className="slot-list">
        {exceptions.map((exc, index) => {
          const rawStart = exc.START_DATE_TIME || exc.StartDateTime || exc.start;
          const rawEnd = exc.END_DATE_TIME || exc.EndDateTime || exc.end;
          const reason = exc.REASON || exc.Reason || exc.title || 'Blocare';

          const parseLocalDate = (str) => {
            if (!str || typeof str !== 'string' || !str.includes('T') && !str.includes(' ')) return null;
            const [d, t] = str.split(/[T ]/);
            const [y, m, day] = d.split('-').map(Number);
            const [h, min] = t.split(':').map(Number);
            return new Date(y, m - 1, day, h, min);
          };

          const start = parseLocalDate(rawStart);
          const end = parseLocalDate(rawEnd);

          const validStart = start instanceof Date && !isNaN(start);
          const validEnd = end instanceof Date && !isNaN(end);

          return (
            <li key={index} className="slot-row exception">
              <span className="slot-time">
                {validStart && validEnd
                  ? `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Dată invalidă'}
              </span>
              <span className="slot-label">{reason}</span>
              <button onClick={() => handleDeleteException(exc.id)} className="btn-delete">Șterge</button>
            </li>
          );
        })}
      </ul>
      <button className="close-btn" onClick={() => setShowExceptions(false)}>Închide</button>
    </div>
  </div>
)}

      <Footer />
    </div>
  );
};

export default ScheduleManagement;
