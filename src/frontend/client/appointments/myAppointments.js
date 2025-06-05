import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Navbar from '../../navbar';
import Footer from '../../footer';
import './myAppointments.css';

const MyAppointments = () => {
  const [appointmentsByDate, setAppointmentsByDate] = useState({});
  const token = localStorage.getItem('myvet_token');

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await fetch('http://localhost:5000/api/client/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("APPOINTMENT RAW DATA:", data);

      // Group appointments by date
      const grouped = {};
      data.forEach(appt => {
        const dateKey = new Date(appt.data_start).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        console.log("APPOINTMENT RAW DATA:", data);
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(appt);
      });

      setAppointmentsByDate(grouped);
    };

    fetchAppointments();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="appointments-wrapper">
        <div className="appointments-header">
            <div className="appointments-header-top">
                <h1>Upcoming Appointments</h1>
                <Link to="/client/appointments" className="back-button-appointments">← Back</Link>
            </div>
            <p>View and manage all scheduled appointments</p>
        </div>

        {Object.keys(appointmentsByDate).length === 0 ? (
          <div className="no-appointments-message">
            <p>You have no upcoming appointments.</p>
          </div>
        ) : (
          Object.entries(appointmentsByDate).map(([date, appointments]) => (
            <div className="appointment-date-block" key={date}>
              <h2>{date}</h2>
              <p>{appointments.length} appointment{appointments.length > 1 ? 's' : ''}</p>

              <div className="appointment-table">
                <div className="appointment-table-header">
                  <span>Time</span>
                  <span>Pet</span>
                  <span>Doctor</span>
                  <span>Appointment Type</span>
                  <span>Extra Services</span>
                  <span>Status</span>
                </div>

                {appointments.map((appt, index) => (
                  <div className="appointment-row" key={index}>
                    <div>
                      <strong>{appt.data_start.split('T')[1].slice(0, 5)}</strong>
                    </div>

                    <div className="pet-cell">
                      <img src={appt.pet_photo ? `http://localhost:5000/${appt.pet_photo}` : '/default-pet.png'} alt={appt.pet_name} />
                      <div>
                        <strong>{appt.pet_name}</strong><br />
                        <small>{appt.pet_type} • {appt.pet_breed}</small>
                      </div>
                    </div>

                    <div className="doctor-cell">
                      <img src={appt.doctor_photo ? `http://localhost:5000/${appt.doctor_photo}` : '/default-doctor.png'} alt={appt.doctor_name} />
                      <span>{appt.doctor_name}</span>
                    </div>

                    <div>{appt.appointment_type}</div>
                    <div>{appt.extra_services || '-'}</div>

                    <div>
                      <span className={`status-badge ${appt.status.toLowerCase()}`}>
                    {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <div className="appointments-disclaimer">
            <p>
                <strong>Note:</strong> To cancel an appointment, please contact the clinic directly at least 24 hours in advance.
            </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAppointments;
