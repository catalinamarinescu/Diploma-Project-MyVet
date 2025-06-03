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
  'default': 'rgb(209, 150, 63)'
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

const parseLocalDate = (str) => {
  try {
    if (!str || typeof str !== 'string') return null;
    const [datePart, timePart] = str.split(' ');
    if (!datePart || !timePart) return null;
    const [y, m, d] = datePart.split('-').map(Number);
    const [h, min] = timePart.split(':').map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(min)) return null;
    return new Date(y, m - 1, d, h, min);
  } catch (error) {
    console.error('Error parsing date:', str, error);
    return null;
  }
};

const ScheduleManagement = () => {
  const token = localStorage.getItem('myvet_token');
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [modalDate, setModalDate] = useState(null);
  const [modalData, setModalData] = useState({ programari: [], exceptii: [], libere: [] });
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
          color: TYPE_COLORS[emp.TIP_ANGAJAT] || TYPE_COLORS.default,
          photo: emp.POZA
            ? `http://localhost:5000/${emp.POZA}`
            : '/default-doctor.png'
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
      }).then(r => r.ok ? r.json() : [])
    ])
      .then(([wh, ex]) => {
        const bh = wh.map(w => ({
          daysOfWeek: [(w.Weekday === 7 ? 0 : w.Weekday - 1)],
          startTime: toHM(w.StartTime),
          endTime: toHM(w.EndTime),
          display: 'background',
          color: '#e0f7fa'
        }));
        setWorkingHours(bh);

        setExceptions(Array.isArray(ex) ? ex.map(e => {
          const start = parseLocalDate(e.StartDateTime);
          const end = parseLocalDate(e.EndDateTime);

          let startText = '??';
          let endText = '??';

          if (start instanceof Date && !isNaN(start)) {
            startText = start.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
          if (end instanceof Date && !isNaN(end)) {
            endText = end.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', hour12: false });
          }

          return {
            start,
            end,
            title: e.REASON || e.Reason || 'Blocare',
            color: '#cccccc',
            id: e.ID,
            startText,
            endText
          };
        }) : []);
      })
      .catch(err => console.error('Error loading schedule data:', err));
  }, [selected, token]);

  const handleDateClick = async (info) => {
  if (!selected) return;

  setModalDate(info.dateStr);
  setModalData({ programari: [], exceptii: [], libere: [] }); // curăță înainte

  try {
    const res = await fetch(
      `http://localhost:5000/api/clinic/angajati/${selected.id}/timeslots?date=${info.dateStr}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    const programari = data
      .filter(s => s.type === 'booked')
      .map(s => s.details);

    const exceptiiMap = new Map();

data
  .filter(s => s.type === 'exception')
  .forEach(s => {
    if (!s.id || exceptiiMap.has(s.id)) return;

    const startStr = s.start?.split('T')[0] + ' ' + s.start?.split('T')[1]?.substring(0, 5);
    const endStr = s.end?.split('T')[0] + ' ' + s.end?.split('T')[1]?.substring(0, 5);

    const start = parseAsLocal(startStr);
    const end = parseAsLocal(endStr);

    if (!start || !end || isNaN(start) || isNaN(end)) return;

    exceptiiMap.set(s.id, {
      StartDateTime: start,
      EndDateTime: end,
      REASON: s.reason || 'Blocare',
      ID: s.id
    });
  });

const exceptii = Array.from(exceptiiMap.values());


    const libere = data.filter(s => s.type === 'free');

    setModalData({ programari, exceptii, libere });
  } catch (error) {
    console.error("Eroare la fetch sloturi/modal:", error);
  }
};


  const handleWorkHoursSave = async (hours) => {
    if (!selected) return;
    try {
      const res = await fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/working-hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(hours)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Eroare la salvarea programului.');
        return;
      }

      setShowWorkForm(false);
    } catch (error) {
      console.error('Eroare la salvare program:', error);
      alert('A apărut o eroare la salvare.');
    }
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

    // Reîncarcă datele de excepții și sloturi după POST
    if (modalDate) {
      const slotRes = await fetch(
        `http://localhost:5000/api/clinic/angajati/${selected.id}/timeslots?date=${modalDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await slotRes.json();

      const programari = data.filter(s => s.type === 'booked').map(s => s.details);

      const exceptii = data
        .filter(s => s.type === 'exception')
        .map(s => {
          const start = new Date(s.start);
          const end = new Date(s.end);
          return {
            StartDateTime: start,
            EndDateTime: end,
            REASON: s.reason,
            ID: s.id
          };
        });

      const libere = data.filter(s => s.type === 'free');

      setModalData({ programari, exceptii, libere });
    }

    setShowExceptionForm(false);
  } catch (error) {
    console.error('Eroare la salvare excepție:', error);
    alert('A apărut o eroare la salvarea excepției.');
  }
};


  const handleDeleteException = async (id) => {
    if (!selected) return;
    await fetch(`http://localhost:5000/api/clinic/exceptions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const exRes = await fetch(`http://localhost:5000/api/clinic/angajati/${selected.id}/exceptions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const exData = await exRes.json();
    setExceptions(Array.isArray(exData) ? exData : []);

    if (modalDate) {
      const filtered = Array.isArray(exData)
        ? exData.filter(e => e.StartDateTime && e.StartDateTime.startsWith(modalDate))
        : [];
      setModalData(prev => ({ ...prev, exceptii: filtered }));
    }
  };

function parseAsLocal(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}


  return (
    <>      <Navbar />
    <div className="schedule-page">
      <div className="schedule-header">
        <h2>Schedule Management</h2>
        <div className="action-buttons">
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
              <img src={emp.photo} alt={emp.name} className="avatar" />
              <div className="info">
                <strong>{emp.name}</strong>
                <span className="specialty">{emp.type}</span>
              </div>
            </div>
          ))}
        </aside>

        <section className="calendar-section">
          {selected && (
            <>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                businessHours={workingHours}
                dateClick={handleDateClick}
                height="auto"
              />

              {modalDate && (
                <div className="modal-backdrop" onClick={() => setModalDate(null)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <h3>Disponibilitate pentru {modalDate}</h3>

                    <h4>Programări</h4>
                    {modalData.programari.map((p, i) => (
                      <div key={i} className="slot-row booked">
                        <strong>{p.time}</strong><br />
                        Stăpân: {p.ownerName}<br />
                        Tel: {p.phone}<br />
                        Animal: {p.petName}<br />
                        Tip: {p.status || 'Nespecificat'}<br />
                        {p.notes && <>Notițe: {p.notes}<br /></>}
                      </div>
                    ))}

                     <h3>Excepții pentru {modalDate}</h3>
                      <ul className="slot-list">
                      {Array.isArray(modalData.exceptii) && modalData.exceptii.map((exc, index) => (
                        <li key={index} className="slot-row exception">
                          <span className="slot-time">
                            {parseAsLocal(exc.StartDateTime)?.toLocaleTimeString('ro-RO', {
                              hour: '2-digit', minute: '2-digit', hour12: false
                            }) || '??'} – {parseAsLocal(exc.EndDateTime)?.toLocaleTimeString('ro-RO', {
                              hour: '2-digit', minute: '2-digit', hour12: false
                            }) || '??'}
                          </span>
                          <span className="slot-label">{exc.REASON || 'Blocare'}</span>
                          <button onClick={() => handleDeleteException(exc.ID)} className="btn-delete">Șterge</button>
                        </li>
                      ))}
                    </ul>
                    <h4>Sloturi libere</h4>
                    {modalData.libere.map((s, i) => (
                      <div key={i} className="slot-row free">{s.time}</div>
                    ))}

                    <button className="close-btn" onClick={() => setModalDate(null)}>Închide</button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {showWorkForm && (
        <div className="modal-backdrop" onClick={() => setShowWorkForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Configurează programul de lucru</h3>
            <WorkHoursForm
              initialHours={[]}
              onCancel={() => setShowWorkForm(false)}
              onSave={handleWorkHoursSave}
            />
          </div>
        </div>
      )}

      {showExceptionForm && (
        <div className="modal-backdrop" onClick={() => setShowExceptionForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Adaugă excepție pentru {modalDate || new Date().toISOString().split('T')[0]}</h3>
            <ExceptionForm
              date={modalDate || new Date().toISOString().split('T')[0]}
              onSave={handleExceptionSave}
              onCancel={() => setShowExceptionForm(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
    </>
  );
};

export default ScheduleManagement;