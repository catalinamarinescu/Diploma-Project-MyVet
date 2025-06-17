// CalendarModal.js
import React, { useState } from 'react';
import './calendar.css';

function parseAsLocal(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}

const CalendarModal = ({
  modalDate,
  modalData,
  onClose,
  onDeleteException,
  onDeleteAppointment,
  doctorName
}) => {
  const [activeTab, setActiveTab] = useState('libere');

  if (!modalDate) return null;

  return (
    <div className="modal-backdrop-calendar" onClick={onClose}>
      <div className="modal-calendar" onClick={e => e.stopPropagation()}>
        <div className="header-calendar">
          <h3>{new Date(modalDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}</h3>
          <p className="subheader-calendar">Schedule overview for Dr. {doctorName}</p>
        </div>

        <div className="tabs-calendar">
          {['libere', 'exceptii', 'programari'].map(tab => (
            <button
              key={tab}
              className={`tab-button-calendar ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'libere' ? 'Available Slots' : tab === 'exceptii' ? 'Exceptions' : 'Appointments'}
            </button>
          ))}
        </div>

        <div className="tab-content-calendar">
         {activeTab === 'libere' && (
          <div className="timeline-calendar">
            {modalData.libere.length > 0 ? (
              modalData.libere.map((slot, idx) => (
                <div key={idx} className="timeline-row-calendar">
                  <span className="time-label-calendar">{slot.time}</span>
                  <span className="event-label-calendar">No events scheduled</span>
                </div>
              ))
            ) : (
              <p className="no-data-calendar">0 slots available</p>
            )}
          </div>
          )}

          {activeTab === 'exceptii' && (
            <div className="list-calendar">
              {modalData.exceptii.length > 0 ? modalData.exceptii.map((exc, i) => (
                <div key={i} className="list-item-calendar">
                  <strong>
                    {parseAsLocal(exc.StartDateTime)?.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} - 
                    {parseAsLocal(exc.EndDateTime)?.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                  </strong>
                  <span>{exc.REASON}</span>
                  <button onClick={() => onDeleteException(exc.ID)} className="btn-delete-calendar">Delete</button>
                </div>
              )) : <p className="no-data-calendar">No exceptions set for this date.</p>}
            </div>
          )}

          {activeTab === 'programari' && (
            <div className="list-calendar">
              {modalData.programari.length > 0 ? modalData.programari.map((p, i) => (
                <div key={i} className="list-item-calendar">
                  <div>
                     <strong>{p.time}</strong> – {p.petName} ({p.ownerName})<br />
    Tel: {p.phone}<br />
    Status: {p.status || 'Nespecificat'}<br />
    Tip programare: <em>{p.appointmentType || '—'}</em><br />
    Extra: {p.extraServices || '—'}<br />
    {p.notes && <>Notes: {p.notes}</>}
                  </div>
                  <button onClick={() => onDeleteAppointment?.(p.id)} className="btn-delete-calendar">Delete</button>
                </div>
              )) : <p className="no-data-calendar">No appointments found.</p>}
            </div>
          )}
        </div>

        <button className="close-btn-calendar" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CalendarModal;
