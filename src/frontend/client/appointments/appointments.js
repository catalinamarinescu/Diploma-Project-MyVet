import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../navbar';
import Footer from '../../footer';

import StepSelectPetClinic from './selectPet';
import StepSelectClinic from './selectClinic';
import StepSelectExtras from './selectExtras';
import StepSelectMedic from './selectVet';
import StepSelectDateTime from './selectDateTime';
import StepConfirm from './confirm';
import StepSelectService from './selectAppType';

import './appointments.css';

const AppointmentForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    petId: '',
    clinicId: '',
    selectedService: '',
    selectedExtras: [],
    medicId: '',
    date: '',
    time: '',
    note: ''
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    <StepSelectPetClinic
      formData={formData}
      setFormData={setFormData}
      onNext={nextStep}
    />,
    <StepSelectClinic
      formData={formData}
      setFormData={setFormData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <StepSelectService
      formData={formData}
      setFormData={setFormData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <StepSelectExtras
      formData={formData}
      setFormData={setFormData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <StepSelectMedic
      formData={formData}
      setFormData={setFormData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <StepSelectDateTime
      formData={formData}
      setFormData={setFormData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <StepConfirm
      formData={formData}
      onBack={prevStep}
    />
  ];

  return (
    <>
      <Navbar />
      <div className="appointment-wrapper">
        <div className="appointment-container">
          <div className="appointment-topbar">
            <div>
              <Link to="/client/myappointments" className="view-my-appointments-btn">
                View My Appointments
              </Link>
              <h1 className="appointment-title">Book Appointment</h1>
              <p className="appointment-subtitle">Schedule a visit for your pet</p>
            </div>
            <Link to="/" className="back-button">← Back to Dashboard</Link>
          </div>

          <div className="step-progress-bar">
            {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
              <React.Fragment key={num}>
                <div className={`step-circle ${step === num ? 'active' : ''}`}>
                  {num}
                </div>
                {index !== 6 && <div className="step-line"></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="appointment-card">
            {steps[step - 1]}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentForm;
