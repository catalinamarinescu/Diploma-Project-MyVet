import React, { useState } from 'react';
import Navbar from '../../navbar';
import Footer from '../../footer';

import StepSelectPetClinic from './selectPet';
import StepSelectClinic from './selectClinic';
import StepSelectExtras from './selectExtras';
// import StepSelectExtras from './StepSelectExtras';
// import StepSelectMedic from './StepSelectMedic';
// import StepSelectDateTime from './StepSelectDateTime';
// import StepConfirm from './StepConfirm';
import './appointments.css';
import StepSelectService from './selectAppType';

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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
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
    // <StepSelectMedic
    //   formData={formData}
    //   setFormData={setFormData}
    //   onNext={nextStep}
    //   onBack={prevStep}
    // />,
    // <StepSelectDateTime
    //   formData={formData}
    //   setFormData={setFormData}
    //   onNext={nextStep}
    //   onBack={prevStep}
    // />,
    // <StepConfirm
    //   formData={formData}
    //   onBack={prevStep}
    // />,
  ];

  return (
    <>
      <Navbar/>
      <div className="appointment-content">
      <h2 className="appointment-title">Book Appointment</h2>
      <p className="appointment-subtitle">Step {step} of 6</p>

      <div className="step-progress">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className={`step-circle ${step === num ? 'active' : ''}`}
          >
            {num}
          </div>
        ))}
      </div>

      {steps[step - 1]}
    </div>
    <Footer/>
  </>
  );
};

export default AppointmentForm;
